import type { WeeekComment, weeekHeadingSchema, weeekListSchema, weeekParagraphSchema, weeekTableSchema, weekTextMarksSchema } from "@/api/weeek/types";
import type { z } from "zod";

const addTextWrappers = (text: string, marks?: z.infer<typeof weekTextMarksSchema>) => {
  let symbolsToAdd = "";
  if (marks) {
    for (const mark of marks) {
      switch (mark.type) {
        case "bold":
          symbolsToAdd += "*";
          break;
        case "italic":
          symbolsToAdd += "_";
          break;
        case "underline":
          symbolsToAdd += "+";
          break;
        case "strike":
        case "line-through":
          symbolsToAdd += "-";
          break;
      }
    }
  }
  return `${symbolsToAdd}${text}${symbolsToAdd.split("").reverse().join("")}`;
}

const transformParagraphLine = (
	content: z.infer<typeof weeekParagraphSchema>["content"],
) => 
  content
    ?.map((line) => {
      switch (line.type) {
        case "text":
          return addTextWrappers(line.text, line.marks);
        case "line_break":
          return "\n";
        default:
          return null;
      }
    })
    .filter(Boolean).join(" ") ?? "";
;

const transformHeadingLine = (
  attrs: z.infer<typeof weeekHeadingSchema>["attrs"],
	content: z.infer<typeof weeekHeadingSchema>["content"],
) => 
  content.map((line) => `h${attrs.level}. ${line.text}`).filter(Boolean).join("\n");

const transformBulletListLine = (
  content: z.infer<typeof weeekListSchema>["content"],
) => 
  content.map((listItem) => `* ${transformParagraphLine(listItem.content)}`).join("\n");

const transformOrderedListLine = (
  content: z.infer<typeof weeekListSchema>["content"],
) => 
  content.map((listItem) => `# ${transformParagraphLine(listItem.content)}`).join("\n");

const transformTableLine = (
  content: z.infer<typeof weeekTableSchema>["content"],
): string => 
  content?.map((tableRow) => `|${tableRow.content.map(
    (cell) => transformWeekCommentToJira(cell.content, "|")
  )}|`).join("\n") ?? "";


export const transformWeekCommentToJira = (commentLines: WeeekComment, joinWith = "\n"): string => {
  return commentLines.map((line) => {
    switch (line.type) {
      case "paragraph":
      case "code":
        return transformParagraphLine(line.content);
      case "heading":
        return transformHeadingLine(line.attrs, line.content);
      case "video":
        case "file":
        return `[^${line.attrs.name}]`;
      case "image":
        return `!${line.attrs.name}!`;
      case "hr":
        return "----";
      case "bullet_list":
        return transformBulletListLine(line.content);
      case "ordered_list":
        return transformOrderedListLine(line.content);
      case "table":
        return transformTableLine(line.content);
      case "colout":
        return line.content ? transformWeekCommentToJira(line.content) : "";
      case "task_list":
        return line.content ? line.content.map((task) => transformWeekCommentToJira(task.content)) : "";
      case "toggle_list":
        return line.content 
        ? line.content?.map(
          (toggleItem) => toggleItem.content
            .map((itemContent) => itemContent.type === "toggle_list_content" 
            ? transformWeekCommentToJira(itemContent.content)
            : ""
          ).join("\n"))
        : "";
      default:
        return "";
    }
  }).join(joinWith);
};
