import { Send, Terminal, Image as ImageIcon, X, Sparkles } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';

interface ChatInputProps {
  onSend: (message: string, image?: { data: string, mimeType: string }) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<{ url: string, data: string, mimeType: string } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if ((input.trim() || selectedImage) && !disabled) {
      onSend(input.trim(), selectedImage ? { data: selectedImage.data, mimeType: selectedImage.mimeType } : undefined);
      setInput('');
      setSelectedImage(null);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setSelectedImage({
          url: URL.createObjectURL(file),
          data: base64.split(',')[1],
          mimeType: file.type
        });
      };
      reader.readAsDataURL(file);
    }
    // Clear input so same file can be selected again
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  return (
    <form onSubmit={handleSubmit} className="px-4 pb-6 pt-2 max-w-[800px] mx-auto w-full">
      {selectedImage && (
        <div className="mb-4 relative inline-block">
          <img 
            src={selectedImage.url} 
            alt="Upload preview" 
            className="h-20 w-20 object-cover rounded-lg border border-border"
          />
          <button
            type="button"
            onClick={() => setSelectedImage(null)}
            className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
          >
            <X size={12} />
          </button>
        </div>
      )}
      <div className="relative group">
        <textarea
          ref={textareaRef}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything ....."
          className="w-full bg-[#141414] border border-border focus:border-accent/40 rounded-xl py-4 pl-4 pr-24 text-foreground text-sm resize-none placeholder:text-muted-foreground outline-none transition-all"
          disabled={disabled}
        />
        <div className="absolute right-3 bottom-[14px] flex items-center gap-2">
          <input 
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className="p-2 text-muted-foreground hover:text-white transition-all rounded-lg"
            title="Upload image"
          >
            <ImageIcon size={18} />
          </button>
          <button
            type="submit"
            disabled={(!input.trim() && !selectedImage) || disabled}
            className="bg-accent text-white p-2 rounded-lg transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center w-8 h-8"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </form>
  );
}
