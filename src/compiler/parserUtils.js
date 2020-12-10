function valueToString(ctx) {
    let value = null;
    if (ctx.INT() != null) {
        value = ctx.INT().getText();
    }
    else if (ctx.QUOTE() != null) {
        value = unquote(ctx.QUOTE().getText());
    }
    return value;
}

function unquote(value) {
    return value.substring(1, value.length - 1);
}

export {valueToString, unquote}