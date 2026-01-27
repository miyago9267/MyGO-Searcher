export interface SortOption {
  label: string
  value: string
}

export interface SortPopupProps {
  show: boolean
  modelValue: string
}

export interface PopupBaseProps {
  modelValue?: boolean
}

export interface PopupBaseEmits {
  'update:modelValue': [value: boolean]
  'close': []
}

export interface ButtonIconProps {
  icon?: string
  label?: string
  ariaLabel?: string
}
