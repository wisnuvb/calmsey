"use client";

import { useEffect, useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import type { Editor as TinyMCEEditorType } from "tinymce";

interface TinyMCEEditorProps {
  value?: string;
  onChange: (content: string) => void;
  placeholder?: string;
  height?: number;
  onImageUpload?: (file: File) => Promise<string>;
}

export function TinyMCEEditor({
  value,
  onChange,
  placeholder,
  height = 500,
  onImageUpload,
}: TinyMCEEditorProps) {
  const editorRef = useRef<TinyMCEEditorType | null>(null);

  // Sync value with editor content when value prop changes
  useEffect(() => {
    if (editorRef.current && value !== undefined) {
      const currentContent = editorRef.current.getContent();
      if (currentContent !== value) {
        editorRef.current.setContent(value || "");
      }
    }
  }, [value]);

  const handleUploadImage = async (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    blobInfo: any,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    progress: (percent: number) => void
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
    <Editor
      tinymceScriptSrc="/tinymce/tinymce.min.js"
      licenseKey="gpl"
      onInit={(_evt, editor) => (editorRef.current = editor)}
      value={value}
      init={{
        height,
        menubar: true,
        placeholder,
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
        toolbar:
          "undo redo | formatselect fontsizeselect | " +
          "bold italic underline strikethrough | forecolor backcolor | " +
          "alignleft aligncenter alignright alignjustify | " +
          "bullist numlist outdent indent | " +
          "link image media table | " +
          "code fullscreen preview | " +
          "removeformat help",
        toolbar_mode: "sliding",
        content_style:
          "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",

        // URL configurations
        document_base_url: "/tinymce",
        skin_url: "/tinymce/skins/ui/oxide",
        content_css: "/tinymce/skins/content/default/content.css",
        theme_url: "/tinymce/themes/silver/theme.min.js",
        model_url: "/tinymce/models/dom/model.js",
        icons_url: "/tinymce/icons/default/icons.js",

        // External plugins
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
          insertdatetime: "/tinymce/plugins/insertdatetime/plugin.min.js",
          media: "/tinymce/plugins/media/plugin.min.js",
          table: "/tinymce/plugins/table/plugin.min.js",
          help: "/tinymce/plugins/help/plugin.min.js",
          wordcount: "/tinymce/plugins/wordcount/plugin.min.js",
        },

        // Image upload handler
        images_upload_handler: onImageUpload ? handleUploadImage : undefined,
        automatic_uploads: true,
        file_picker_types: "image",

        // Image options
        image_advtab: true,
        image_caption: true,
        image_title: true,

        // Link options
        link_assume_external_targets: true,
        link_title: false,
        target_list: [
          { title: "Same window", value: "" },
          { title: "New window", value: "_blank" },
        ],

        // Table options
        table_toolbar:
          "tableprops tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol",
        table_appearance_options: true,
        table_grid: true,
        table_resize_bars: true,

        // Additional options
        branding: false,
        promotion: false,
        statusbar: true,
        elementpath: true,
        resize: true,
      }}
      onEditorChange={(content) => onChange(content)}
    />
  );
}
