import EventLangVisitor from "../../lib/EventLangVisitor";
import {valueToString} from "@/compiler/parserUtils";
import Filter from "@/compiler/filter";

export default class TestVisitor extends EventLangVisitor {
    visitComplex_test(ctx) {
        if (ctx.complex_test() == null) {
            return this.visit(ctx.test());
        }
        let f = new Filter();1
        let f1 = this.visit(ctx.complex_test());
        if (ctx.test() != null) {
            let f2 = this.visit(ctx.test());
            if (ctx.AND() != null) {
                f.all_of = [f1, f2];
            } else if (ctx.OR() != null) {
                f.any_of = [f1, f2];
            }
        } else if (ctx.NOT() != null || ctx.LITERAL_NOT() != null) {
            f.none_of = [f1];
        }
        return f;
    }

    visitTest(ctx) {
        let f = new Filter();
        if (ctx.name().length === 2) {
            f.subject = ctx.name(0).getText();
            f.test = ctx.name(1).getText();
        } else {
            f.test = ctx.name(0).getText();
        }
        f.operator = ctx.operator().getText();
        f.value = valueToString(ctx.value());
        return f;
    }
}