## RuLeStudio-1.0.0-rc.8:
#### Added
- Implement react-router.
- Measure calculations time on the server and display it in ResultListSubheader.
- Enable resetting global object visible name in SettingsDialog.
- Add loading snackbar when exporting project.

#### Fixed
- Prevent "No." column in Data from disappearing when creating empty project.
- Refresh data after project's changed in a different tab.
- Take into account changes in identification/descriptive fields of a data set.
- Reassign descriptive attribute in a new calculation result.
- Refresh main attributes menu after calculations.
- Fix sending data after project was deleted
- Fix crashing in classified object details dialog when no covered objects.
- Fix duplicating project after deleting it in Rules or Classification tab.
- Correct tooltip for rule in classified object details.

#### Changed
- Optimize omitting repetitions of identical calculations.
- Tidy up logs in a server's console.
- Change names of Java classes to more appropriate.  
- Create Dialogs folder and move every Dialog to that folder.
- Move SortMenu to Menus folder.
- Create Buttons folder and move every Button to that folder.
- Move TabBody to Containers.
- Move Themes to Utils.
- Bump XStream library version to 1.4.14
- Bump project's export version to 1.0.0-rc.8

## RuLeStudio-1.0.0-rc.7:
#### Added
- Extend documentation for fetch functions. 
- Control descriptive attributes separately for each calculated resource.
- Add a menu and button for changing visible object's name.
- Enable OutdatedData to display custom messages from the server.
- Add 'type' field to custom exceptions.
- Add InvalidPathParamsException and use it in fetch functions.
- Add standalone PropTypes object for StyledButton and StyledIconButton.

#### Removed
- Remove all serializer classes.

#### Fixed
- Correct error when misclassification matrix has zero's everywhere
- Distinguish different types of incompatibility between calculated resources.

#### Changed
- Implement new Rest API.
- Control version of export/import files.  
- Move to rule's details in classified object dialog by double-clicking on a rule.  
- Move all fetch functions to utils.
- Bump XStream library to 1.4.14

## RuLeStudio-1.0.0-rc.6:
#### Added
- Add Home page.
- Add frontend documentation.
- Enable importing and exporting project.
- Allow filling cells with consecutive numbers and cells containing concatenated string with number (e.g. Object10)
  by pressing Ctrl key before dragging.
- Add standalone StyledIconButton.
- Create AlertError class and throw it in fetch functions.

#### Fixed
- Turn off cell copy and paste while doing actions that change cell's position
  (e.g. deleting the row with the selected cell).
- Use "id" as a "none" selection in SortMenu in Rules.
- Reindent files in Data.

#### Changed
- Use indices to recognize objects in each cross-validation fold.
- Optimize cross-validation response. 
- Generalise "none" selection in SortMenu.
- Reorganize CSS classes in StyledButton and StyledIconButton.
- Create folder in utils to store fetch functions.
- Bump ruleLearn version to 0.21.0

## RuLeStudio-1.0.0-rc.5
#### Added
- Add Help page.
- Add slides component.
- Display rule's details in classified object's details dialog.
- Enable changing visible object name in Data.
- Enable only one active identification attribute in Data.
- Enable only one active decision attribute in Data.
- Add information about the attribute activeness under the attribute name in Data.
- Change attribute activeness via right click menu on the column header in Data.
- Add a timeout to search text field.
- Add CircleHelper in ResultList in Cones and Rules.
- Add CircleHelper to the left of upload buttons in Rules and Classification.
- Remember button selection in Classification.
- Add tooltips to missing value types (mv1.5, mv2) in both Add and Edit attribute dialogs in Data.  
- Disable GPU acceleration in tooltips to make text not blurred in Chrome browser.
- Add standalone StyledTab and StyledTabs components.

#### Removed
- Array icon from TablesList.

#### Fixed
- Deep copy a project to prevent state from unexpected updates.
- Fix saving current data/metadata to files in Data.
- Catch ruleLearn exceptions and send them with 4** status.  
- Avoid NullPointerException when external dataset without decision attribute is classified.
- Don't classify an external dataset, when uploaded file doesn't contain any object (empty file).
- Before classification, set default decision as missing value. 
  There is no other decision to set when learning informationTable does not contain decision attribute.  
- Sort objects in some properties of a class union.
- Correct position of right click menu on the column header in Data.
- Fix Undo and Redo tooltips in Data.
- Corrections in filtering in Rules.
- Corrections in CircleHelper in Calculations.

#### Changed
- Identify information table by hash.
- Change NoRulesException status from 404 to 463.
- Print the cause of error while reading metadata from String.  
- Generalise AlertBadge and ExternalFile.
- Change color of OutdatedData alert.
- Bump ruleLearn version to 0.21.0-rc.13  
- Bump frontend-maven-plugin version to 1.10.0
- Bump node version to v12.16.3
- Bump yarn version to v1.22.4

## RuLeStudio-1.0.0-rc.4:
#### Added
- New button to show information about files used in a project.
  File names will be displayed in a list below button.
- Distinguish supporting objects in "indices of covered objects" list.  
- Error is displayed when data from project isn't a valid training set for rules.

#### Fixed
- Change "example" to "object" in Data.

#### Changed
- Change font size in tooltips to "smaller".
- Reorganize layout in "Cones", "Unions", "Rules", "Classification" & "CrossValidation".
- Customize scrollbar in components mentioned above.  
- Change endpoint for uploading rules.
- Project will be updated when classifying external data file.
- Better error handling in fetch functions.

## RuLeStudio-1.0.0-rc.3:
#### Added
- Allow a user to start application on ports different from 8080.
- Display a badge when sort params are different from original in Rules.
- Add tooltips to calculate split button in Classification.
- Use BigNumber to choose seed for Cross-validation.
- Serialize and display certainty and original decision in Classification and Cross-validation.
- Conjugate number of covering rules in Classification and Cross-validation.  
- Add restrictions when choosing number of folds for Cross-validation.
- Enable ResultList to display CircleHelper.
- Add possibility to style rows in TableItemsList.  
- Bold important info in helper tooltips in calculations.

#### Fixed
- Correct serialization of array with decision domain.
- Rules are displayed according to sort params after calculations in Rules.
- Correct grammar or linguistic mistakes in:
  - calculate buttons in Unions, Rules and Cross-validation,
  - helper tooltips in calculations in tabs mentioned above.
- No more three dots when number has sufficient space in MatrixDialog.
- Solve Firefox problems with scrollbar in SortMenu.  
- Correct merging CSS classes in CircleHelper.

#### Changed
- Change "item" to "object" in Cones.
- Simplify serialization of EvaluationField in Union.
- Move "Objects" to the beginning when serializing Unions.  
- Upward unions will be displayed before downward unions.  
- Exclude rule's type from sort menu in Rules.
- Reorganize displaying rules in Rules.  
- Change "sum" to "accumulated" in Cross-validation.
- Reorganize displaying items in ResultList.  
- Change "sorting direction" to "sorting order" in SortMenu.  
- Change "%09" to "\t" in CSVDialog.
- Bump ruleLearn version to 0.21.0-rc.6

## RuLeStudio-1.0.0-rc.2:
#### Added
- Add more extensive tooltip on "Impose Preference" button.

#### Removed
- Turn off autoComplete in text fields when importing, deleting & renaming project.
- Stop using JavaFX Pair class.

#### Fixed:
- Correct error messages sent to the client.
