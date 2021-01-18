import EventLangVisitor from "../../lib/EventLangVisitor";
import Event from '@/compiler/event'
import Actions from "@/compiler/actions";
import {unquote} from "@/compiler/parserUtils";
import TestVisitor from "@/compiler/testVisitor";

export default class EventVisitor extends EventLangVisitor {
    visitEvents(ctx) {
        if (ctx.statement().length === 0) {
            return null;
        } else if (ctx.statement().length === 1) {
            return this.visit(ctx.statement(0));
        } else {
            let e = new Event();
            e.sequence = [];
            for (let i = 0; i < ctx.statement().length;i++) {
                e.sequence.push(this.visit(ctx.statement(i)));
            }
            return e;
        }
    }

    visitStatement(ctx) {
        let e = new Event();
        e.filters = new TestVisitor().visit(ctx.complex_test());
        for (let actionContext in ctx.block().action()) {
            actionContext = ctx.block().action()[actionContext];
            if (actionContext.statement() != null) {
                if (e.sequence == null) {
                    e.sequence = [];
                }
                e.sequence.push(this.visit(actionContext.statement()));
            } else if (actionContext.ADD() != null) {
                if (e.add == null) {
                    e.add = new Actions();
                }
                e.add.component_groups.push(unquote(actionContext.QUOTE().getText()));
            } else if (actionContext.REMOVE() != null) {
                if (e.remove == null) {
                    e.remove = new Actions();
                }
                e.remove.component_groups.push(unquote(actionContext.QUOTE().getText()));
            }
        }
        return e;
    }
}