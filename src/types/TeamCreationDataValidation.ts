export interface TeamCreationDataValidation {
  isRolesValid: boolean;
  isNameValid: boolean;
  isDescriptionValid: boolean;
  nameError: 'length' | 'format' | null;
  descError: 'length' | 'format' | null;
  rolesError: 'length' | 'format' | null;
}
