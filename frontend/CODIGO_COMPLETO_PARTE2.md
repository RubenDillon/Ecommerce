# Código Completo del Frontend - Parte 2: Contexts, Hooks y Componentes Comunes

## 1. App Context (src/contexts/AppContext.tsx)

```typescript
// src/contexts/AppContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { storage } from '@utils/storage';

interface AppContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(storage.getTheme());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    storage.setTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <AppContext.Provider value={{ theme, toggleTheme, isLoading, setIsLoading }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
```

## 2. Carrito Context (src/contexts/CarritoContext.tsx)

```typescript
// src/contexts/CarritoContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CarritoItem, Producto, Cliente } from '@types/index';
import { storage } from '@utils/storage';

interface CarritoContextType {
  items: CarritoItem[];
  clienteSeleccionado: Cliente | null;
  setClienteSeleccionado: (cliente: Cliente | null) => void;
  agregarItem: (producto: Producto, cantidad: number) => void;
  actualizarCantidad: (idProducto: number, cantidad: number) => void;
  eliminarItem: (idProducto: number) => void;
  limpiarCarrito: () => void;
  getTotal: () => number;
  getCantidadItems: () => number;
}

const CarritoContext = createContext<CarritoContextType | undefined>(undefined);

export const CarritoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CarritoItem[]>(() => {
    return storage.getCarrito<CarritoItem[]>() || [];
  });
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);

  useEffect(() => {
    storage.setCarrito(items);
  }, [items]);

  const agregarItem = (producto: Producto, cantidad: number) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.producto.idProducto === producto.idProducto);
      
      if (existingItem) {
        return prevItems.map(item =>
          item.producto.idProducto === producto.idProducto
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        );
      }
      
      return [...prevItems, {
        producto,
        cantidad,
        precioUnitario: producto.valorVenta,
      }];
    });
  };

  const actualizarCantidad = (idProducto: number, cantidad: number) => {
    if (cantidad <= 0) {
      eliminarItem(idProducto);
      return;
    }
    
    setItems(prevItems =>
      prevItems.map(item =>
        item.producto.idProducto === idProducto
          ? { ...item, cantidad }
          : item
      )
    );
  };

  const eliminarItem = (idProducto: number) => {
    setItems(prevItems => prevItems.filter(item => item.producto.idProducto !== idProducto));
  };

  const limpiarCarrito = () => {
    setItems([]);
    setClienteSeleccionado(null);
    storage.clearCarrito();
    storage.clearClienteSeleccionado();
  };

  const getTotal = () => {
    return items.reduce((total, item) => total + (item.precioUnitario * item.cantidad), 0);
  };

  const getCantidadItems = () => {
    return items.reduce((total, item) => total + item.cantidad, 0);
  };

  return (
    <CarritoContext.Provider
      value={{
        items,
        clienteSeleccionado,
        setClienteSeleccionado,
        agregarItem,
        actualizarCantidad,
        eliminarItem,
        limpiarCarrito,
        getTotal,
        getCantidadItems,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
};

export const useCarrito = () => {
  const context = useContext(CarritoContext);
  if (!context) {
    throw new Error('useCarrito must be used within CarritoProvider');
  }
  return context;
};
```

## 3. Custom Hooks - useAsync (src/hooks/useAsync.ts)

```typescript
// src/hooks/useAsync.ts
import { useState, useEffect, useCallback } from 'react';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  immediate = true
) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: immediate,
    error: null,
  });

  const execute = useCallback(async () => {
    setState({ data: null, loading: true, error: null });
    
    try {
      const data = await asyncFunction();
      setState({ data, loading: false, error: null });
      return data;
    } catch (error) {
      setState({ data: null, loading: false, error: error as Error });
      throw error;
    }
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { ...state, execute };
}
```

## 4. Custom Hooks - useDebounce (src/hooks/useDebounce.ts)

```typescript
// src/hooks/useDebounce.ts
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

## 5. Custom Hooks - usePagination (src/hooks/usePagination.ts)

```typescript
// src/hooks/usePagination.ts
import { useState, useMemo } from 'react';

interface UsePaginationProps<T> {
  items: T[];
  itemsPerPage?: number;
}

export function usePagination<T>({ items, itemsPerPage = 10 }: UsePaginationProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / itemsPerPage);

  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  }, [items, currentPage, itemsPerPage]);

  const goToPage = (page: number) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
  };

  const nextPage = () => {
    goToPage(currentPage + 1);
  };

  const prevPage = () => {
    goToPage(currentPage - 1);
  };

  return {
    currentItems,
    currentPage,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
}
```

## 6. Loading Component (src/components/common/Loading.tsx)

```typescript
// src/components/common/Loading.tsx
import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingProps {
  message?: string;
  size?: number;
}

export const Loading: React.FC<LoadingProps> = ({ message = 'Cargando...', size = 40 }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="200px"
      gap={2}
    >
      <CircularProgress size={size} />
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
};
```

## 7. Error Message Component (src/components/common/ErrorMessage.tsx)

```typescript
// src/components/common/ErrorMessage.tsx
import React from 'react';
import { Alert, AlertTitle, Box } from '@mui/material';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'Error',
  message,
  onRetry,
}) => {
  return (
    <Box my={2}>
      <Alert severity="error" onClose={onRetry ? onRetry : undefined}>
        <AlertTitle>{title}</AlertTitle>
        {message}
      </Alert>
    </Box>
  );
};
```

## 8. Confirm Dialog Component (src/components/common/ConfirmDialog.tsx)

```typescript
// src/components/common/ConfirmDialog.tsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  confirmColor = 'primary',
}) => {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="inherit">
          {cancelText}
        </Button>
        <Button onClick={onConfirm} color={confirmColor} variant="contained" autoFocus>
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
```

## 9. Search Bar Component (src/components/common/SearchBar.tsx)

```typescript
// src/components/common/SearchBar.tsx
import React, { useState } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { useDebounce } from '@hooks/useDebounce';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  debounceDelay?: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Buscar...',
  debounceDelay = 500,
}) => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, debounceDelay);

  React.useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  const handleClear = () => {
    setQuery('');
  };

  return (
    <TextField
      fullWidth
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder={placeholder}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
        endAdornment: query && (
          <InputAdornment position="end">
            <IconButton size="small" onClick={handleClear}>
              <ClearIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};
```

## 10. Page Header Component (src/components/common/PageHeader.tsx)

```typescript
// src/components/common/PageHeader.tsx
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  onAdd?: () => void;
  addButtonText?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  onAdd,
  addButtonText = 'Agregar',
}) => {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
      {onAdd && (
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={onAdd}
        >
          {addButtonText}
        </Button>
      )}
    </Box>
  );
};
```

## 11. Data Table Component (src/components/common/DataTable.tsx)

```typescript
// src/components/common/DataTable.tsx
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Box,
  TablePagination,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

export interface Column<T> {
  id: keyof T | string;
  label: string;
  minWidth?: number;
  align?: 'left' | 'right' | 'center';
  format?: (value: any, row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  page?: number;
  rowsPerPage?: number;
  totalRows?: number;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
  getRowId?: (row: T) => string | number;
}

export function DataTable<T>({
  columns,
  data,
  onView,
  onEdit,
  onDelete,
  page = 0,
  rowsPerPage = 10,
  totalRows,
  onPageChange,
  onRowsPerPageChange,
  getRowId = (row: any) => row.id,
}: DataTableProps<T>) {
  const hasActions = onView || onEdit || onDelete;

  const handleChangePage = (_: unknown, newPage: number) => {
    onPageChange?.(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    onRowsPerPageChange?.(parseInt(event.target.value, 10));
  };

  return (
    <Paper>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id as string}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
              {hasActions && (
                <TableCell align="center" style={{ minWidth: 150 }}>
                  Acciones
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow hover key={getRowId(row)}>
                {columns.map((column) => {
                  const value = (row as any)[column.id];
                  return (
                    <TableCell key={column.id as string} align={column.align}>
                      {column.format ? column.format(value, row) : value}
                    </TableCell>
                  );
                })}
                {hasActions && (
                  <TableCell align="center">
                    <Box display="flex" justifyContent="center" gap={1}>
                      {onView && (
                        <Tooltip title="Ver">
                          <IconButton size="small" onClick={() => onView(row)}>
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {onEdit && (
                        <Tooltip title="Editar">
                          <IconButton size="small" onClick={() => onEdit(row)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {onDelete && (
                        <Tooltip title="Eliminar">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => onDelete(row)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {onPageChange && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={totalRows || data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
          }
        />
      )}
    </Paper>
  );
}
```

## 12. Stat Card Component (src/components/common/StatCard.tsx)

```typescript
// src/components/common/StatCard.tsx
import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: string;
  subtitle?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color = 'primary.main',
  subtitle,
}) => {
  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography color="text.secondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" component="div" sx={{ color }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          {icon && (
            <Box
              sx={{
                backgroundColor: `${color}15`,
                borderRadius: 2,
                p: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {icon}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
```

## 13. Image Selector Component (src/components/common/ImageSelector.tsx)

```typescript
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
```

## 14. Empty State Component (src/components/common/EmptyState.tsx)

```typescript
// src/components/common/EmptyState.tsx
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';

interface EmptyStateProps {
  title: string;
  message?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  icon = <InboxIcon sx={{ fontSize: 64 }} />,
  actionLabel,
  onAction,
}) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="300px"
      textAlign="center"
      p={3}
    >
      <Box color="text.secondary" mb={2}>
        {icon}
      </Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {message && (
        <Typography variant="body2" color="text.secondary" mb={3}>
          {message}
        </Typography>
      )}
      {actionLabel && onAction && (
        <Button variant="contained" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Box>
  );
};
```

---

**Continúa en CODIGO_COMPLETO_PARTE3.md con Layout y Páginas principales**