import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { Message } from '../types';
import { Download, X, Maximize2 } from 'lucide-react';
import { useState } from 'react';

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isAssistant = message.role === 'assistant';
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleDownload = (url: string, filename: string = 'monerai-image.png') => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full mb-8 px-4 md:px-8"
    >
      <div className={`max-w-[800px] mx-auto flex w-full ${isAssistant ? 'justify-start' : 'justify-end'} relative`}>
        <div className={`${
          isAssistant 
            ? 'w-full bg-transparent text-foreground/90' 
            : 'max-w-[85%] md:max-w-[80%] p-4 rounded-2xl bg-[#1a1a1a] border border-border text-foreground'
        }`}>
          <div className="prose-dark prose-sm prose-invert">
            <ReactMarkdown
              components={{
                img: ({ node, src, alt, ...props }) => {
                  const isGenerated = src?.startsWith('IMAGE_GEN:');
                  if (isGenerated) {
                    const prompt = src?.replace('IMAGE_GEN:', '');
                    const imageUrl = `https://picsum.photos/seed/${encodeURIComponent(prompt || 'gen')}/1024/1024`;
                    
                    return (
                      <div className="my-4 relative group/img cursor-pointer">
                        <img 
                          src={imageUrl} 
                          alt={alt || "Generated image"} 
                          className="rounded-xl border border-border w-full h-auto max-h-[512px] object-contain bg-[#0a0a0a]"
                          referrerPolicy="no-referrer"
                          onClick={() => setSelectedImage(imageUrl)}
                        />
                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover/img:opacity-100 transition-opacity">
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleDownload(imageUrl); }}
                            className="bg-black/60 backdrop-blur-md p-2 rounded-lg text-white hover:bg-black/80 transition-colors"
                            title="Download Image"
                          >
                            <Download size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  }
                  return <img src={src} alt={alt} {...props} referrerPolicy="no-referrer" className="rounded-xl border border-border" />;
                }
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>

          {!isAssistant && message.images && message.images.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {message.images.map((img, idx) => (
                <div key={idx} className="relative group/userimg cursor-pointer" onClick={() => setSelectedImage(img.url)}>
                  <img 
                    src={img.url} 
                    alt="User uploaded" 
                    className="h-32 w-auto max-w-full rounded-lg border border-border object-cover"
                  />
                  <div className="absolute top-1 right-1 opacity-0 group-hover/userimg:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDownload(img.url); }}
                      className="bg-black/40 p-1.5 rounded-md text-white hover:bg-black/60"
                    >
                      <Download size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 md:p-8"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
            >
              <X size={32} />
            </button>
            <motion.img 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={selectedImage} 
              alt="Preview" 
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <button 
              onClick={(e) => { e.stopPropagation(); handleDownload(selectedImage); }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-accent text-white px-6 py-2.5 rounded-full flex items-center gap-2 hover:bg-accent/80 transition-all font-bold"
            >
              <Download size={20} />
              Download Image
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
