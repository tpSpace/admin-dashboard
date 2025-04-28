import Image from "next/image";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  previewImages: string[];
  onDrop: (files: File[]) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
}

export default function ImageUpload({
  previewImages,
  onDrop,
  handleFileChange,
  removeImage,
}: ImageUploadProps) {
  return (
    <FormItem>
      <FormLabel>Product Images</FormLabel>
      <FormControl>
        <div className="space-y-4">
          {/* Drag and drop area */}
          <div
            className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors"
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const files = Array.from(e.dataTransfer.files);
              onDrop(files);
            }}
            onClick={() => {
              const input = document.getElementById(
                "image-upload"
              ) as HTMLInputElement;
              if (input) input.click();
            }}
          >
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm font-medium">
                Drag and drop images here or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Supports: JPG, PNG, GIF (Max 5MB each, up to 10 images)
              </p>
            </div>
            <input
              id="image-upload"
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* Image preview grid */}
          {previewImages.length > 0 && (
            <div className="images-preview-container">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-60 overflow-y-auto p-2">
                {previewImages.map((src, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square rounded-md overflow-hidden border bg-muted relative group-hover:ring-2 group-hover:ring-primary/50 transition-all">
                      <Image
                        src={
                          src.startsWith("http") || src.startsWith("data:")
                            ? src
                            : `data:image/jpeg;base64,${src}`
                        }
                        alt={`Preview ${index + 1}`}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                        className="object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(index);
                        }}
                        aria-label={`Remove image ${index + 1}`}
                        className="absolute top-1 right-1 h-5 w-5 rounded-full p-0.5 shadow-md text-white bg-red-500 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                {previewImages.length} of 10 images uploaded
              </div>
            </div>
          )}
        </div>
      </FormControl>
      <FormDescription>
        Upload up to 10 product images (max 5MB each)
      </FormDescription>
      <FormMessage />
    </FormItem>
  );
}
