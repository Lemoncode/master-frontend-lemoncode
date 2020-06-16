import React from 'react';
import { Lookup } from 'common/models';

export interface RowRendererProps<T = {}> {
  row: T;
  onEdit?: (id: string) => void;
  onDelete?: (lookup: Lookup) => void;
}

export interface LabelProps {
  searchPlaceholder?: string;
  createButton?: string | React.ReactNode;
  deleteTitle?: string | React.ReactNode;
  deleteContent?: (props: { itemName: string }) => React.ReactNode;
  closeButton?: string;
  acceptButton?: string;
}

export const createEmptyLabelProps = (): LabelProps => ({
  searchPlaceholder: '',
  createButton: '',
  deleteTitle: '',
  deleteContent: undefined,
  closeButton: '',
  acceptButton: '',
});
