export const drawArrow = (
    ctx: CanvasRenderingContext2D,
    fromx: number,
    fromy: number,
    tox: number,
    toy: number,
    text: string = "",
    color: string = "#000",
    isMobile: boolean = false
) => {
    const headlen = isMobile ? 8 : 10; // length of head in pixels
    const dx = tox - fromx;
    const dy = toy - fromy;
    const angle = Math.atan2(dy, dx);

    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = isMobile ? 1 : 1.5;

    ctx.beginPath();
    ctx.moveTo(fromx, fromy);
    ctx.lineTo(tox, toy);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(tox, toy);
    ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
    ctx.lineTo(tox, toy);
    ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
    ctx.fill();

    if (text) {
        const midX = (fromx + tox) / 2;
        const midY = (fromy + toy) / 2;
        ctx.fillStyle = color;
        ctx.font = `${isMobile ? 10 : 12}px Inter`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        // Offset text slightly to avoid overlapping the line
        ctx.fillText(text, midX, midY - 5);
    }
    ctx.restore();
};
