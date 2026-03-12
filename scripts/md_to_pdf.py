#!/usr/bin/env python3
"""
Convert a Markdown file to a clean McKinsey-style PDF using fpdf2.
Usage: python scripts/md_to_pdf.py path/to/file.md
Output: same directory as input, same name with .pdf extension
"""

import sys
import re
from pathlib import Path
from fpdf import FPDF

# ─── Colors (McKinsey-inspired: dark navy + white + blue accent) ───────────────
C_BG        = (255, 255, 255)
C_TEXT      = (30,  30,  45)
C_LIGHT     = (100, 100, 120)
C_ACCENT    = (0,   70,  127)   # McKinsey navy blue
C_RULE      = (210, 215, 225)
C_H1_BG     = (0,   70,  127)
C_H1_TEXT   = (255, 255, 255)
C_H2_TEXT   = (0,   70,  127)
C_H3_TEXT   = (50,  50,  80)
C_TABLE_HDR = (235, 240, 248)
C_TABLE_ALT = (248, 250, 252)
C_CODE_BG   = (245, 246, 248)


UNICODE_FONT = "/Library/Fonts/Arial Unicode.ttf"


class McKinseyPDF(FPDF):
    def __init__(self, title=""):
        super().__init__()
        self.title_text = title
        self.set_auto_page_break(auto=True, margin=20)
        self.set_margins(22, 22, 22)
        # Load Unicode font (supports Chinese + special chars)
        self.add_font("Arial", style="", fname=UNICODE_FONT)
        self.add_font("Arial", style="B", fname=UNICODE_FONT)
        self.add_font("Arial", style="I", fname=UNICODE_FONT)
        self.add_font("Arial", style="BI", fname=UNICODE_FONT)

    def header(self):
        if self.page_no() == 1:
            return
        self.set_y(8)
        self.set_font("Arial", "I", 7)
        self.set_text_color(*C_LIGHT)
        self.cell(0, 4, self.title_text, align="L")
        self.cell(0, 4, f"Page {self.page_no()}", align="R", new_x="LMARGIN", new_y="NEXT")
        self.set_draw_color(*C_RULE)
        self.set_line_width(0.3)
        self.line(self.l_margin, 14, self.w - self.r_margin, 14)
        self.ln(3)

    def footer(self):
        self.set_y(-14)
        self.set_draw_color(*C_RULE)
        self.set_line_width(0.3)
        self.line(self.l_margin, self.get_y(), self.w - self.r_margin, self.get_y())
        self.ln(1)
        self.set_font("Arial", "", 7)
        self.set_text_color(*C_LIGHT)
        self.cell(0, 5, "Avantia2a | Confidential", align="C")


def parse_md(path: Path) -> list[dict]:
    """Parse markdown into a list of typed blocks."""
    lines = path.read_text(encoding="utf-8").splitlines()
    blocks = []
    i = 0
    in_table = False
    table_rows = []

    while i < len(lines):
        line = lines[i]

        # Table detection
        if "|" in line and line.strip().startswith("|"):
            if not in_table:
                in_table = True
                table_rows = []
            # Skip separator lines like |---|---|
            if not re.match(r"^\|\s*[-:]+\s*\|", line):
                cells = [c.strip() for c in line.strip().strip("|").split("|")]
                table_rows.append(cells)
            i += 1
            continue
        elif in_table:
            blocks.append({"type": "table", "rows": table_rows})
            in_table = False
            table_rows = []

        # Code block
        if line.startswith("```"):
            code_lines = []
            i += 1
            while i < len(lines) and not lines[i].startswith("```"):
                code_lines.append(lines[i])
                i += 1
            blocks.append({"type": "code", "text": "\n".join(code_lines)})
            i += 1
            continue

        # Headings
        m = re.match(r"^(#{1,4})\s+(.*)", line)
        if m:
            level = len(m.group(1))
            blocks.append({"type": f"h{level}", "text": m.group(2).strip()})
            i += 1
            continue

        # HR
        if re.match(r"^---+$", line.strip()):
            blocks.append({"type": "hr"})
            i += 1
            continue

        # Bullet
        m = re.match(r"^(\s*)[-*]\s+(.*)", line)
        if m:
            indent = len(m.group(1)) // 2
            blocks.append({"type": "bullet", "text": m.group(2), "indent": indent})
            i += 1
            continue

        # Numbered list
        m = re.match(r"^(\s*)\d+\.\s+(.*)", line)
        if m:
            indent = len(m.group(1)) // 2
            blocks.append({"type": "numbered", "text": m.group(2), "indent": indent})
            i += 1
            continue

        # Blank line
        if not line.strip():
            blocks.append({"type": "blank"})
            i += 1
            continue

        # Regular paragraph
        blocks.append({"type": "para", "text": line})
        i += 1

    if in_table:
        blocks.append({"type": "table", "rows": table_rows})

    return blocks


def strip_md_inline(text: str) -> str:
    """Remove inline markdown formatting."""
    text = re.sub(r"\*\*(.+?)\*\*", r"\1", text)
    text = re.sub(r"\*(.+?)\*", r"\1", text)
    text = re.sub(r"`(.+?)`", r"\1", text)
    text = re.sub(r"\[(.+?)\]\(.+?\)", r"\1", text)
    return text


def render_pdf(blocks: list[dict], out_path: Path, doc_title: str):
    pdf = McKinseyPDF(title=doc_title)
    pdf.add_page()

    blank_count = 0
    num_counter = 1

    for b in blocks:
        btype = b["type"]

        if btype == "blank":
            blank_count += 1
            if blank_count == 1:
                pdf.ln(3)
            continue
        blank_count = 0

        # ── H1 (document title style) ──────────────────────────────────────────
        if btype == "h1":
            if pdf.get_y() > 30:
                pdf.ln(6)
            # Blue full-width background bar
            pdf.set_fill_color(*C_H1_BG)
            pdf.set_text_color(*C_H1_TEXT)
            pdf.set_font("Arial", "B", 16)
            pdf.ln(2)
            pdf.cell(0, 12, strip_md_inline(b["text"]), fill=True,
                     new_x="LMARGIN", new_y="NEXT", align="L")
            pdf.ln(4)

        # ── H2 ─────────────────────────────────────────────────────────────────
        elif btype == "h2":
            pdf.ln(5)
            pdf.set_font("Arial", "B", 12)
            pdf.set_text_color(*C_H2_TEXT)
            pdf.cell(0, 7, strip_md_inline(b["text"]), new_x="LMARGIN", new_y="NEXT")
            # Underline rule
            pdf.set_draw_color(*C_ACCENT)
            pdf.set_line_width(0.5)
            pdf.line(pdf.l_margin, pdf.get_y(), pdf.w - pdf.r_margin, pdf.get_y())
            pdf.ln(3)

        # ── H3 ─────────────────────────────────────────────────────────────────
        elif btype == "h3":
            pdf.ln(3)
            pdf.set_font("Arial", "B", 10)
            pdf.set_text_color(*C_H3_TEXT)
            pdf.cell(0, 6, strip_md_inline(b["text"]), new_x="LMARGIN", new_y="NEXT")
            pdf.ln(1)

        # ── H4 ─────────────────────────────────────────────────────────────────
        elif btype == "h4":
            pdf.set_font("Arial", "BI", 9)
            pdf.set_text_color(*C_H3_TEXT)
            pdf.cell(0, 5, strip_md_inline(b["text"]), new_x="LMARGIN", new_y="NEXT")

        # ── HR ─────────────────────────────────────────────────────────────────
        elif btype == "hr":
            pdf.ln(3)
            pdf.set_draw_color(*C_RULE)
            pdf.set_line_width(0.3)
            pdf.line(pdf.l_margin, pdf.get_y(), pdf.w - pdf.r_margin, pdf.get_y())
            pdf.ln(4)

        # ── PARAGRAPH ──────────────────────────────────────────────────────────
        elif btype == "para":
            pdf.set_font("Arial", "", 9)
            pdf.set_text_color(*C_TEXT)
            pdf.multi_cell(0, 5, strip_md_inline(b["text"]), new_x="LMARGIN", new_y="NEXT")
            pdf.ln(1)

        # ── BULLET ─────────────────────────────────────────────────────────────
        elif btype == "bullet":
            indent = b.get("indent", 0) * 5
            pdf.set_font("Arial", "", 9)
            pdf.set_text_color(*C_TEXT)
            x = pdf.l_margin + indent
            # Bullet dot
            pdf.set_x(x)
            pdf.set_font("Arial", "B", 9)
            pdf.set_text_color(*C_ACCENT)
            pdf.cell(5, 5, "•")  # bullet
            pdf.set_font("Arial", "", 9)
            pdf.set_text_color(*C_TEXT)
            pdf.multi_cell(pdf.w - pdf.r_margin - x - 5, 5,
                           strip_md_inline(b["text"]), new_x="LMARGIN", new_y="NEXT")

        # ── NUMBERED ───────────────────────────────────────────────────────────
        elif btype == "numbered":
            indent = b.get("indent", 0) * 5
            pdf.set_x(pdf.l_margin + indent)
            pdf.set_font("Arial", "B", 9)
            pdf.set_text_color(*C_ACCENT)
            pdf.cell(7, 5, f"{num_counter}.")
            num_counter += 1
            pdf.set_font("Arial", "", 9)
            pdf.set_text_color(*C_TEXT)
            pdf.multi_cell(pdf.w - pdf.r_margin - pdf.l_margin - indent - 7, 5,
                           strip_md_inline(b["text"]), new_x="LMARGIN", new_y="NEXT")

        # ── CODE BLOCK ─────────────────────────────────────────────────────────
        elif btype == "code":
            pdf.ln(2)
            pdf.set_fill_color(*C_CODE_BG)
            pdf.set_draw_color(*C_RULE)
            pdf.set_line_width(0.2)
            pdf.set_font("Arial", "", 7.5)
            pdf.set_text_color(*C_H3_TEXT)
            for cl in b["text"].splitlines():
                pdf.set_x(pdf.l_margin)
                pdf.cell(0, 4.5, cl, fill=True, new_x="LMARGIN", new_y="NEXT")
            pdf.ln(2)

        # ── TABLE ──────────────────────────────────────────────────────────────
        elif btype == "table":
            rows = b["rows"]
            if not rows:
                continue
            pdf.ln(3)
            num_cols = max(len(r) for r in rows)
            col_w = (pdf.w - pdf.l_margin - pdf.r_margin) / num_cols

            for ri, row in enumerate(rows):
                is_header = ri == 0
                fill_color = C_TABLE_HDR if is_header else (C_TABLE_ALT if ri % 2 == 0 else C_BG)
                pdf.set_fill_color(*fill_color)
                pdf.set_draw_color(*C_RULE)
                pdf.set_line_width(0.2)

                # Calculate row height first
                max_lines = 1
                for cell in row:
                    approx = len(strip_md_inline(cell)) / max(int(col_w / 2), 1) + 1
                    max_lines = max(max_lines, int(approx))
                row_h = max(5, min(max_lines * 4, 16))

                start_y = pdf.get_y()
                start_x = pdf.l_margin

                for ci, cell in enumerate(row):
                    pdf.set_xy(start_x + ci * col_w, start_y)
                    if is_header:
                        pdf.set_font("Arial", "B", 8)
                        pdf.set_text_color(*C_H2_TEXT)
                    else:
                        pdf.set_font("Arial", "", 8)
                        pdf.set_text_color(*C_TEXT)
                    pdf.multi_cell(col_w, row_h / max(max_lines, 1),
                                   strip_md_inline(cell), border=1,
                                   fill=True, align="L",
                                   new_x="RIGHT", new_y="TOP")

                pdf.set_xy(pdf.l_margin, start_y + row_h)

            pdf.ln(4)

    pdf.output(str(out_path))
    return out_path


def convert(md_path: str):
    src = Path(md_path)
    if not src.exists():
        print(f"File not found: {md_path}")
        sys.exit(1)
    dst = src.with_suffix(".pdf")
    blocks = parse_md(src)
    doc_title = src.stem.replace("-", " ").replace("_", " ")
    render_pdf(blocks, dst, doc_title)
    print(f"PDF saved: {dst}")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python scripts/md_to_pdf.py path/to/file.md")
        sys.exit(1)
    convert(sys.argv[1])
