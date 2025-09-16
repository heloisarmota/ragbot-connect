import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  Upload, 
  FileImage, 
  X, 
  Download, 
  FileText, 
  Loader2,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import jsPDF from "jspdf";

interface ImageFile {
  file: File;
  id: string;
  preview: string;
}

const PdfConverter = () => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newImages = acceptedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      preview: URL.createObjectURL(file)
    }));
    
    setImages(prev => [...prev, ...newImages]);
    
    toast({
      title: "Imagens adicionadas",
      description: `${acceptedFiles.length} imagem(ns) adicionada(s) com sucesso.`,
    });
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    multiple: true
  });

  const removeImage = (id: string) => {
    setImages(prev => {
      const imageToRemove = prev.find(img => img.id === id);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      return prev.filter(img => img.id !== id);
    });
  };

  const clearAll = () => {
    images.forEach(img => URL.revokeObjectURL(img.preview));
    setImages([]);
    setPdfUrl(null);
  };

  const convertToPdf = async () => {
    if (images.length === 0) {
      toast({
        title: "Erro",
        description: "Adicione pelo menos uma imagem para converter.",
        variant: "destructive",
      });
      return;
    }

    setIsConverting(true);
    setProgress(0);

    try {
      const pdf = new jsPDF();
      
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        setProgress(((i + 1) / images.length) * 100);

        // Create an image element to get dimensions
        const img = new Image();
        img.src = image.preview;
        
        await new Promise((resolve) => {
          img.onload = resolve;
        });

        // Calculate dimensions to fit the page
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 20;
        
        const maxWidth = pageWidth - (margin * 2);
        const maxHeight = pageHeight - (margin * 2);
        
        let { width, height } = img;
        
        // Scale image to fit page while maintaining aspect ratio
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
        
        // Center the image on the page
        const x = (pageWidth - width) / 2;
        const y = (pageHeight - height) / 2;

        if (i > 0) {
          pdf.addPage();
        }
        
        pdf.addImage(image.preview, 'JPEG', x, y, width, height);
      }

      // Generate PDF blob and create download URL
      const pdfBlob = pdf.output('blob');
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);

      toast({
        title: "Conversão concluída!",
        description: "Seu PDF foi gerado com sucesso e está pronto para download.",
      });

    } catch (error) {
      console.error('Erro na conversão:', error);
      toast({
        title: "Erro na conversão",
        description: "Ocorreu um erro ao converter as imagens para PDF.",
        variant: "destructive",
      });
    } finally {
      setIsConverting(false);
    }
  };

  const downloadPdf = () => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `imagens-convertidas-${new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
          <FileText className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Conversor de Imagens para PDF</h1>
          <p className="text-muted-foreground">Converta suas imagens JPG e PNG em documentos PDF</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upload Area */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload de Imagens
            </CardTitle>
            <CardDescription>
              Arraste e solte suas imagens ou clique para selecionar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              {...getRootProps()}
              className={`
                border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                ${isDragActive 
                  ? 'border-primary bg-primary/5' 
                  : 'border-muted-foreground/25 hover:border-primary/50'
                }
              `}
            >
              <input {...getInputProps()} />
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              {isDragActive ? (
                <p className="text-primary font-medium">Solte as imagens aqui...</p>
              ) : (
                <div>
                  <p className="font-medium mb-2">Clique ou arraste imagens aqui</p>
                  <p className="text-sm text-muted-foreground">
                    Suporta arquivos JPG e PNG (múltiplos arquivos)
                  </p>
                </div>
              )}
            </div>

            {images.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Imagens Selecionadas ({images.length})</h3>
                  <Button variant="ghost" size="sm" onClick={clearAll}>
                    Limpar Tudo
                  </Button>
                </div>
                
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {images.map((image) => (
                    <div key={image.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <img 
                        src={image.preview} 
                        alt={image.file.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{image.file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(image.file.size)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeImage(image.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Conversion Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Conversão
            </CardTitle>
            <CardDescription>
              Configure e inicie a conversão para PDF
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {images.length > 0 && (
              <Alert>
                <FileImage className="w-4 h-4" />
                <AlertDescription>
                  {images.length} imagem(ns) pronta(s) para conversão. 
                  Cada imagem será colocada em uma página separada.
                </AlertDescription>
              </Alert>
            )}

            <Separator />

            <div className="space-y-4">
              <Button 
                onClick={convertToPdf}
                disabled={images.length === 0 || isConverting}
                className="w-full"
                size="lg"
              >
                {isConverting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Convertendo...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    Converter para PDF
                  </>
                )}
              </Button>

              {isConverting && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progresso da conversão</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} />
                </div>
              )}

              {pdfUrl && (
                <Alert className="border-success/20 bg-success/5">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <AlertDescription className="text-success">
                    PDF gerado com sucesso! Clique no botão abaixo para fazer o download.
                  </AlertDescription>
                </Alert>
              )}

              {pdfUrl && (
                <Button 
                  onClick={downloadPdf}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PdfConverter;