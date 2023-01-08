import * as vscode from 'vscode';
import * as moment from 'moment';


export let headerString = "/**************************************\n";
headerString = headerString + "Author : <type your name here> /\n";
headerString = headerString + "Purpose : <Explain usage of this code> /\n";
headerString = headerString + "TimeStamp : <DateTime> /\n";
headerString = headerString + "**************************************/\n";


export default{

    initInfo() {
        let editor = vscode.window.activeTextEditor!;
        editor.edit((builder) => {
          
            let document = editor.document || (editor as any)._documentData._document;
            let tplText = this.getTplText(document);
            builder.insert(new vscode.Position(0, 0), tplText);    
        });
      },

    getTplText(document:vscode.TextDocument) {
        let config = this.getConfig();
        headerString=headerString.replace(/<DateTime>/,config.date as string);
        return headerString;
      },

    getConfig() {
        let config: any = vscode.workspace.getConfiguration('author-generator');
        config = {
          date: this.getDate()
        };
        return config;
      },

    getDate() {
    let config: any = vscode.workspace.getConfiguration('author-generator');
    let dateFormat = config.get('dateFormat') || 'YYYY-MM-DD HH:mm:ss';
    return moment().format(dateFormat);
    }
    };

let commentId = 1;

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