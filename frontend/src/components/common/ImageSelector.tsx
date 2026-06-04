// src/components/common/ImageSelector.tsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Card,
  CardMedia,
  CardActionArea,
  Box,
  Typography,
  Tabs,
  Tab,
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { imageService } from '@services/imageService';
import { ImageSuggestion } from '@types/index';
import { Loading } from './Loading';

interface ImageSelectorProps {
  open: boolean;
  onClose: () => void;
  onSelect: (imageUrl: string) => void;
  categoria?: string;
  productName?: string;
}

export const ImageSelector: React.FC<ImageSelectorProps> = ({
  open,
  onClose,
  onSelect,
  categoria = 'Productos',
  productName,
}) => {
  const [tabValue, setTabValue] = useState(0);
  const [suggestions, setSuggestions] = useState<ImageSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  useEffect(() => {
    if (open && tabValue === 0) {
      loadSuggestions();
    }
  }, [open, categoria, tabValue]);

  const loadSuggestions = async () => {
    setLoading(true);
    try {
      const images = await imageService.getSuggestions(categoria, productName);
      setSuggestions(images);
    } catch (error) {
      console.error('Error loading image suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        try {
          const imageUrl = await imageService.uploadImage(file);
          setUploadedImage(imageUrl);
        } catch (error) {
          console.error('Error uploading image:', error);
        }
      }
    },
  });

  const handleSelectSuggestion = (imageUrl: string) => {
    onSelect(imageUrl);
    onClose();
  };

  const handleSelectUploaded = () => {
    if (uploadedImage) {
      onSelect(uploadedImage);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Seleccionar Imagen</DialogTitle>
      <DialogContent>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)} sx={{ mb: 2 }}>
          <Tab label="Sugerencias" />
          <Tab label="Subir Imagen" />
        </Tabs>

        {tabValue === 0 && (
          <>
            {loading ? (
              <Loading message="Cargando sugerencias..." />
            ) : (
              <Grid container spacing={2}>
                {suggestions.map((suggestion, index) => (
                  <Grid item xs={6} sm={4} md={3} key={index}>
                    <Card>
                      <CardActionArea onClick={() => handleSelectSuggestion(suggestion.url)}>
                        <CardMedia
                          component="img"
                          height="150"
                          image={suggestion.thumbnail}
                          alt={suggestion.description}
                        />
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}

        {tabValue === 1 && (
          <Box>
            <Box
              {...getRootProps()}
              sx={{
                border: '2px dashed',
                borderColor: isDragActive ? 'primary.main' : 'grey.300',
                borderRadius: 2,
                p: 4,
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <input {...getInputProps()} />
              <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="body1" gutterBottom>
                {isDragActive
                  ? 'Suelta la imagen aquí'
                  : 'Arrastra una imagen o haz clic para seleccionar'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Formatos soportados: PNG, JPG, JPEG, GIF, WEBP
              </Typography>
            </Box>

            {uploadedImage && (
              <Box mt={3} textAlign="center">
                <Typography variant="subtitle2" gutterBottom>
                  Vista previa:
                </Typography>
                <img
                  src={uploadedImage}
                  alt="Preview"
                  style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 8 }}
                />
              </Box>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        {tabValue === 1 && uploadedImage && (
          <Button onClick={handleSelectUploaded} variant="contained" color="primary">
            Usar esta imagen
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};