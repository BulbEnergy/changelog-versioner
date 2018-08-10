/** unist types */
declare module "Unist" {
  import Mdast from "Mdast";

  export interface Node {
    type: Mdast.NodeType;
    data?: Data;
    position?: Position;
  }

  export interface Data {}

  export interface Position {
    start: Point;
    end: Point;
    indent?: number;
  }

  export interface Point {
    line: number;
    column: number;
    offset: number;
  }

  export interface Parent extends Node {
    children: Node[];
  }

  export interface Text extends Node {
    value: string;
  }
}

/** mdast types */
declare module "Mdast" {
  import Unist from "Unist";
  export type Node =
    | Root
    | Paragraph
    | Blockquote
    | Heading
    | Code
    | InlineCode
    | YAML
    | HTML
    | List
    | ListItem
    | Table
    | TableRow
    | TableCell
    | ThematicBreak
    | Break
    | Emphasis
    | Strong
    | Delete
    | Link
    | Image
    | Footnote
    | LinkReference
    | ImageReference
    | FootnoteReference
    | Definition
    | FootnoteDefinition
    | TextNode;

  export type NodeType = Node["type"];

  export interface Parent extends Unist.Parent {
    children: Node[];
  }

  export interface Root extends Parent {
    type: "root";
  }

  export interface Paragraph extends Parent {
    type: "paragraph";
  }

  export interface Blockquote extends Parent {
    type: "blockquote";
  }

  export interface Heading extends Parent {
    type: "heading";
    depth: number;
  }

  export interface Code extends Unist.Text {
    type: "code";
    lang: string | null;
    info: string | null;
  }

  export interface InlineCode extends Unist.Text {
    type: "inlineCode";
  }

  export interface YAML extends Unist.Text {
    type: "yaml";
  }

  export interface HTML extends Unist.Text {
    type: "html";
  }

  export interface List extends Parent {
    type: "list";
    ordered: true | false;
    start: number | null;
    loose: true | false;
    children: ListItem[];
  }

  export interface ListItem extends Parent {
    type: "listItem";
    loose: true | false;
    checked: true | false | null;
  }

  export interface Table extends Parent {
    type: "table";
    align: Array<"left" | "right" | "center" | null>;
    children: TableRow[];
  }

  export interface TableRow extends Parent {
    type: "tableRow";
    children: TableCell[];
  }

  export interface TableCell extends Parent {
    type: "tableCell";
  }

  export interface ThematicBreak extends Unist.Node {
    type: "thematicBreak";
  }

  export interface Break extends Unist.Node {
    type: "break";
  }

  export interface Emphasis extends Parent {
    type: "emphasis";
  }

  export interface Strong extends Parent {
    type: "strong";
  }

  export interface Delete extends Parent {
    type: "delete";
  }

  export interface Link extends Parent {
    type: "link";
    title: string | null;
    url: string;
  }

  export interface Image extends Unist.Node {
    type: "image";
    title: string | null;
    alt: string | null;
    url: string;
  }

  export interface Footnote extends Parent {
    type: "footnote";
  }

  export interface LinkReference extends Parent {
    type: "linkReference";
    identifier: string;
    referenceType: "shortcut" | "collapsed" | "full";
  }

  export interface ImageReference extends Unist.Node {
    type: "imageReference";
    identifier: string;
    referenceType: "shortcut" | "collapsed" | "full";
    alt: string | null;
  }

  export interface FootnoteReference extends Unist.Node {
    type: "footnoteReference";
    identifier: string;
  }

  export interface Definition extends Unist.Node {
    type: "definition";
    identifier: string;
    title: string | null;
    url: string;
  }

  export interface FootnoteDefinition extends Parent {
    type: "footnoteDefinition";
    identifier: string;
  }

  export interface TextNode extends Unist.Text {
    type: "text";
  }
}
