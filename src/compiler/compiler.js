import EventLangLexer from '../../lib/EventLangLexer'
import EventLangParser from '../../lib/EventLangParser'
import antlr4 from 'antlr4'
import EventVisitor from "@/compiler/eventVisitor";
import Event from '@/compiler/event'
import ErrorListener from "@/compiler/errorListener";

function compile(source, onError) {
    let chars = new antlr4.InputStream(source);
    let lexer = new EventLangLexer(chars);
    let tokens = new antlr4.CommonTokenStream(lexer);
    let parser = new EventLangParser(tokens);
    parser.buildParseTrees = true;
    parser.removeErrorListeners();
    parser.addErrorListener(new ErrorListener(onError));
    let events = parser.events();
    let eventVisitor = new EventVisitor();
    let result = eventVisitor.visit(events);
    if (result != null && result.filters != null && (result.add != null || result.remove != null)) {
        let e = new Event();
        e.sequence = [];
        e.sequence.push(result);
        result = e;
    }
    return result || {};
}

export default compile;