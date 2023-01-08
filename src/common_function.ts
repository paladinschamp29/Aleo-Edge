/* eslint-disable @typescript-eslint/naming-convention */
import * as vscode from 'vscode';

interface message{
	1:string,
	2:string
}
const message:message={	1:"All Caps not allowed",
			   	2:"Secure Code Vulnerability"
				};
				
export function refreshDiagnostics(doc: vscode.TextDocument, aleoDiagnotics: vscode.DiagnosticCollection,include:string,key:number): void {
	//aleoDiagnotics.dispose();
	const diagnostics: vscode.Diagnostic[] = [];

	for (let lineIndex = 0; lineIndex < doc.lineCount; lineIndex++) {
		const lineOfText = doc.lineAt(lineIndex);
		if (lineOfText.text.includes(include) && !lineOfText.text.trim().startsWith("//")) {
			let diagonistic=createDiagnostic(doc, lineOfText, lineIndex,include,key);
			if(!diagnostics.includes(diagonistic)){
			diagnostics.push(createDiagnostic(doc, lineOfText, lineIndex,include,key));
			}
		}
	}

	aleoDiagnotics.set(doc.uri, diagnostics);
}

export function createDiagnostic(doc: vscode.TextDocument, lineOfText: vscode.TextLine, lineIndex: number,include:any,key:any):
vscode.Diagnostic {
const index = lineOfText.text.indexOf(include);

	// create range that represents, where in the document the word is
	const range = new vscode.Range(lineIndex, index, lineIndex, index + include.length);
	const messagekey: keyof message = key as any;
	const newLocal = include+" - "+message[messagekey];
	const diagnostic = new vscode.Diagnostic(range, newLocal, vscode.DiagnosticSeverity.Information);
	return diagnostic;

	
}

export function subscribeToDocumentChanges(context: vscode.ExtensionContext, aleoDiagnotics: vscode.DiagnosticCollection,include:string,key: number): void {
	if (vscode.window.activeTextEditor) {
		refreshDiagnostics(vscode.window.activeTextEditor.document, aleoDiagnotics,include,key);
	}
	context.subscriptions.push(
		vscode.window.onDidChangeActiveTextEditor(editor => {
			if (editor) {
				refreshDiagnostics(editor.document, aleoDiagnotics,include,key);
			}
		})
	);

	context.subscriptions.push(
		vscode.workspace.onDidChangeTextDocument(e => refreshDiagnostics(e.document, aleoDiagnotics,include,key))
	);

	context.subscriptions.push(
		vscode.workspace.onDidCloseTextDocument(doc => aleoDiagnotics.delete(doc.uri))
	);

}

export let commentId = 1;

export class NoteComment implements vscode.Comment {
	id: number;
	label: string | undefined;
	savedBody: string | vscode.MarkdownString; // for the Cancel button
	constructor(
		public body: string | vscode.MarkdownString,
		public mode: vscode.CommentMode,
		public author: vscode.CommentAuthorInformation,
		public parent?: vscode.CommentThread,
		public contextValue?: string
	) {
		this.id = ++commentId;
		this.savedBody = this.body;
	}
}

export function replyNoteFunc(reply: vscode.CommentReply) {
	const thread = reply.thread;
	const newComment = new NoteComment(reply.text, vscode.CommentMode.Preview, { name: 'vscode' }, thread, thread.comments.length ? 'canDelete' : undefined);
	if (thread.contextValue === 'draft') {
		newComment.label = 'pending';
	}

	thread.comments = [...thread.comments, newComment];
}






