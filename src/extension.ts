import * as vscode from 'vscode';

import { SystemF } from './systemf.js';

// This method is called when language system_f is entered
export function activate(context: vscode.ExtensionContext) {
	console.log('system-f activated');

	const diagnosticCollection = vscode.languages.createDiagnosticCollection("system-f");
	context.subscriptions.push(diagnosticCollection);

	subscribeToDocumentChanges(context, diagnosticCollection);
}

export function deactivate() {
	console.log('system-f deactivated');
}

export function subscribeToDocumentChanges(context: vscode.ExtensionContext, diagnosticCollection: vscode.DiagnosticCollection): void {
	if (vscode.window.activeTextEditor) {
		refreshDiagnostics(vscode.window.activeTextEditor.document, diagnosticCollection);
	}
	context.subscriptions.push(
		vscode.window.onDidChangeActiveTextEditor(editor => {
			if (editor) {
				refreshDiagnostics(editor.document, diagnosticCollection);
			}
		})
	);

	context.subscriptions.push(
		vscode.workspace.onDidChangeTextDocument(e => refreshDiagnostics(e.document, diagnosticCollection))
	);

	context.subscriptions.push(
		vscode.workspace.onDidCloseTextDocument(doc => diagnosticCollection.delete(doc.uri))
	);
}

export function refreshDiagnostics(doc: vscode.TextDocument, diagnosticCollection: vscode.DiagnosticCollection): void {
	if (doc.languageId !== "system_f") { return; }

	const msgs = SystemF.top(doc.getText());

  const diagnostics = msgs.flatMap(msg => {
    if (msg.loc.length === 0) {
      console.warn("msg.loc.length === 0", msg);
      return [];
    }
    const range = new vscode.Range(
      msg.loc[0][0] - 1, msg.loc[0][1], msg.loc[0][2] - 1, msg.loc[0][3]
    );
    let severity = vscode.DiagnosticSeverity.Information;
    if (msg.ty === "error") {
      severity = vscode.DiagnosticSeverity.Error;
    }
    const diagnostic = new vscode.Diagnostic(range, msg.msg, severity);
    diagnostic.code = 'system_f';
    return diagnostic;
  });

	diagnosticCollection.set(doc.uri, diagnostics);
}
