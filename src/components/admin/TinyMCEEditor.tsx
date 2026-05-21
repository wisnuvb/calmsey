"use client";

import { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import {
  DEFAULT_MS_FORM_EMBED_URL,
  MS_FORM_MODAL_ATTR,
} from "@/lib/ms-form-modal";
import { RICH_TEXT_DOWNLOAD_MODAL_ATTRS } from "@/lib/rich-text-download-modal";
import {
  RichTextInsertDialogsHost,
  type RichTextInsertHostHandle,
} from "@/components/admin/RichTextInsertDialogsHost";

export interface TinyMCEEditorOptions {
  height?: number;
  minHeight?: number;
  menubar?: boolean;
  resize?: boolean;
  toolbar?: string;
  enableMicrosoftFormModal?: boolean;
  enableDownloadModal?: boolean;
  defaultMicrosoftFormUrl?: string;
}

interface TinyMCEEditorProps {
  value?: string;
  onChange: (content: string) => void;
  placeholder?: string;
  height?: number;
  minHeight?: number;
  menubar?: boolean;
  resize?: boolean;
  toolbar?: string;
  enableMicrosoftFormModal?: boolean;
  enableDownloadModal?: boolean;
  defaultMicrosoftFormUrl?: string;
  onImageUpload?: (file: File) => Promise<string>;
}

const DEFAULT_TOOLBAR =
  "undo redo | formatselect fontsizeselect | " +
  "bold italic underline strikethrough | forecolor backcolor | " +
  "alignleft aligncenter alignright alignjustify | " +
  "bullist numlist outdent indent | " +
  "link image media table | " +
  "code fullscreen preview | " +
  "removeformat help";

function withEmbeddedModalToolbar(
  toolbar: string,
  options: { form?: boolean; download?: boolean },
): string {
  const buttons: string[] = [];
  if (options.form) buttons.push("msformmodal");
  if (options.download) buttons.push("msdownloadmodal");
  if (buttons.length === 0) return toolbar;

  const insert = buttons.join(" ");
  if (toolbar.includes("link")) {
    return toolbar.replace(/\blink\b/, `link ${insert}`);
  }
  return `${toolbar} | ${insert}`;
}

const MS_FORM_ICON =
  '<svg width="24" height="24" focusable="false"><path fill="currentColor" d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm-1 4h-4v2h4v6h-2v-4h-2V7ZM8 7h3v2H8v1h2a1 1 0 0 1 1 1v2H8v2H6V7h2Z"/></svg>';

export function TinyMCEEditor({
  value,
  onChange,
  placeholder,
  height = 500,
  minHeight,
  menubar = true,
  resize = true,
  toolbar = DEFAULT_TOOLBAR,
  enableMicrosoftFormModal = false,
  enableDownloadModal = false,
  defaultMicrosoftFormUrl = DEFAULT_MS_FORM_EMBED_URL,
  onImageUpload,
}: TinyMCEEditorProps) {
  const insertHostRef = useRef<RichTextInsertHostHandle>(null);

  const resolvedToolbar = withEmbeddedModalToolbar(toolbar, {
    form: enableMicrosoftFormModal,
    download: enableDownloadModal,
  });

  const downloadAttrs = RICH_TEXT_DOWNLOAD_MODAL_ATTRS.join("|");

  const handleUploadImage = async (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    blobInfo: any,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    progress: (percent: number) => void,
  ): Promise<string> => {
    if (!onImageUpload) {
      throw new Error("Image upload handler not provided");
    }

    try {
      const file = blobInfo.blob() as File;
      const url = await onImageUpload(file);
      return url;
    } catch (error) {
      console.error("Image upload failed:", error);
      throw error;
    }
  };

  return (
    <>
      <Editor
        tinymceScriptSrc="/tinymce/tinymce.min.js"
        licenseKey="gpl"
        value={value}
        init={{
          height,
          min_height: minHeight,
          menubar,
          resize,
          placeholder,
          toolbar: resolvedToolbar,
          extended_valid_elements: `a[href|target|title|role|aria-label|${MS_FORM_MODAL_ATTR}|${downloadAttrs}|class|id|rel]`,
          setup: (editor) => {
            if (enableMicrosoftFormModal) {
              editor.ui.registry.addIcon("ms-form-modal", MS_FORM_ICON);
              editor.ui.registry.addButton("msformmodal", {
                icon: "ms-form-modal",
                tooltip: "Insert Microsoft Form modal link",
                onAction: () => {
                  const selectedText = editor.selection.getContent({
                    format: "text",
                  });
                  insertHostRef.current?.openFormModalInsert(
                    selectedText,
                    (html) => editor.insertContent(html),
                  );
                },
              });
            }

            if (enableDownloadModal) {
              editor.ui.registry.addButton("msdownloadmodal", {
                icon: "download",
                tooltip: "Insert multi-language download modal link",
                onAction: () => {
                  const selectedText = editor.selection.getContent({
                    format: "text",
                  });
                  insertHostRef.current?.openDownloadModalInsert(
                    selectedText,
                    (html) => editor.insertContent(html),
                  );
                },
              });
            }
          },
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "help",
            "wordcount",
          ],
          toolbar_mode: "sliding",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",

          document_base_url: "/",
          convert_urls: false,
          relative_urls: false,
          skin_url: "/tinymce/skins/ui/oxide",
          content_css: "/tinymce/skins/content/default/content.css",
          theme_url: "/tinymce/themes/silver/theme.min.js",
          model_url: "/tinymce/models/dom/model.js",
          icons_url: "/tinymce/icons/default/icons.js",

          external_plugins: {
            advlist: "/tinymce/plugins/advlist/plugin.min.js",
            autolink: "/tinymce/plugins/autolink/plugin.min.js",
            lists: "/tinymce/plugins/lists/plugin.min.js",
            link: "/tinymce/plugins/link/plugin.min.js",
            image: "/tinymce/plugins/image/plugin.min.js",
            charmap: "/tinymce/plugins/charmap/plugin.min.js",
            preview: "/tinymce/plugins/preview/plugin.min.js",
            anchor: "/tinymce/plugins/anchor/plugin.min.js",
            searchreplace: "/tinymce/plugins/searchreplace/plugin.min.js",
            visualblocks: "/tinymce/plugins/visualblocks/plugin.min.js",
            code: "/tinymce/plugins/code/plugin.min.js",
            fullscreen: "/tinymce/plugins/fullscreen/plugin.min.js",
            insertdatetime:
              "/tinymce/plugins/insertdatetime/plugin.min.js",
            media: "/tinymce/plugins/media/plugin.min.js",
            table: "/tinymce/plugins/table/plugin.min.js",
            help: "/tinymce/plugins/help/plugin.min.js",
            wordcount: "/tinymce/plugins/wordcount/plugin.min.js",
          },

          images_upload_handler: onImageUpload ? handleUploadImage : undefined,
          automatic_uploads: true,
          file_picker_types: "image",

          image_advtab: true,
          image_caption: true,
          image_title: true,

          link_assume_external_targets: false,
          link_title: false,
          target_list: [
            { title: "Same window", value: "" },
            { title: "New window", value: "_blank" },
          ],

          table_toolbar:
            "tableprops tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol",
          table_appearance_options: true,
          table_grid: true,
          table_resize_bars: true,

          branding: false,
          promotion: false,
          statusbar: true,
          elementpath: true,
        }}
        onEditorChange={(content) => onChange(content)}
      />

      {(enableMicrosoftFormModal || enableDownloadModal) && (
        <RichTextInsertDialogsHost
          ref={insertHostRef}
          defaultMicrosoftFormUrl={defaultMicrosoftFormUrl}
        />
      )}
    </>
  );
}
