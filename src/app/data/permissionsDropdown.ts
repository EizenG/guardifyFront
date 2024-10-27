import { IDropdownSettings } from "ng-multiselect-dropdown";

export const dropdownListPermissions = [
  { item_id: 1, item_text: "Modifier les paramètres" },
  { item_id: 2, item_text: "Afficher le flux vidéo" },
  { item_id: 3, item_text: "Voir les vidéos d'infractions" },
];

export const dropdownSettingsPermissions: IDropdownSettings = {
  singleSelection: false,
  enableCheckAll: true,
  selectAllText: "Tout sélectionner",
  unSelectAllText: "Tout désélectionner",
  idField: "item_id",
  textField: "item_text",
};