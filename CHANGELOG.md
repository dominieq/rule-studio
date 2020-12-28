## rc-8:
#### Added
- Implement react-router.
- Display calculations time in ResultListSubheader.
- Enable reseting global object visible name in SettingsDialog.
- Added loading snackbar when exporting project.  
- Added changelog.

#### Fixed
- Refresh data after project's changed in different tab.
- Refresh main attributes menu after calculations.
- Fixed sending data after project was deleted
- Fixed crashing in classified details dialog when no covered objects.
- Fixed duplicating project after deleting it in Rules or Classification tab.
- Correct tooltip for rule in classified object details.

#### Changed
- Create Dialogs folder and move every Dialog to that folder.
- Move SortMenu to Menus folder.
- Create Buttons folder and move every Button to that folder.
- Move TabBody to Containers.
- Move Themes to Utils.

## rc-7:
#### Added
- Extend documentation for fetch functions. 
- Control descriptive attributes separately for each calculated resource.
- Added a menu and button for changing visible object's name.
- Enable OutdatedData to display custom messages from the server.
- Added 'type' field to custom exceptions.
- Added InvalidPathParamsException and use it in fetch functions.
- Added standalone PropTypes object for StyledButton and StyledIconButton.

#### Removed
- Removed all serializer classes.

#### Fixed
- Correct error when misclassification matrix has zero's everywhere
- Distinguish different types of incompatibility between calculated resources.

#### Changed
- Implement new Rest API.
- Control version of export/import files.  
- Move to rule's details in classified object dialog by double-clicking on a rule.  
- Move all fetch functions to utils.
- Bump XStream library to 1.4.14

## rc-6:
#### Added
- Added Home page.
- Added frontend documentation.
- Enable importing and exporting project.
- Allow filling cells with consecutive numbers and cells containing concatenated string with number (e.g. Object10)
  by pressing Ctrl key before dragging.
- Added standalone StyledIconButton.
- Create AlertError class and throw it in fetch functions.

#### Fixed
- Turned off cell copy and paste while doing actions that change cell's position
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

## rc-5
#### Added
- Added Help page.
- Added slides component.
- Display rule's details in classified object's details dialog.
- Enable changing visible object name in Data.
- Enable only one active identification attribute in Data.
- Enable only one active decision attribute in Data.
- Information about the attribute activeness under the attribute name in Data.
- Change attribute activeness via right click menu on the column header in Data.
- Added timeout to search text field.
- Enable ResultList to display CircleHelper
- Added CircleHelper in ResultList in Cones and Rules.
- Added CircleHelper to the left of upload buttons in Rules and Classification.
- Remember button selection in Classification.
- Added tooltips to missing value types (mv1.5, mv2) in both Add and Edit attribute dialogs in Data.  
- Disable GPU acceleration in tooltips to make text not blurred in Chrome browser.
- Added standalone StyledTab and StyledTabs components.

#### Removed
- Array icon from TablesList.

#### Fixed
- Deep copy a project to prevent state from unexpected updates.
- Fixed saving current data/metadata to files in Data.
- Catch ruleLearn exceptions and send them with 4** status.  
- Avoid NullPointerException when external dataset without decision attribute is classified.
- Don't classify an external dataset, when uploaded file doesn't contain any object (empty file).
- Before classification, set default decision as missing value. 
  There is no other decision to set when learning informationTable does not contain decision attribute.  
- Sort objects in some properties of a class union.
- Correct position of right click menu on the column header in Data.
- Fixed Undo and Redo tooltips in Data.
- Corrections in filtering in Rules.
- Corrections in CircleHelper in Calculations.

#### Changed
- Identify information table by hash.
- Change NoRulesException status from 404 to 463.
- Print the cause of error while reading metadata from String.  
- Generalise AlertBadge and ExternalFile.
- Changed color of OutdatedData alert.
- Bump ruleLearn version to 0.21.0-rc.13  
- Bump frontend-maven-plugin version to 1.10.0
- Bump node version to v12.16.3
- Bump yarn version to v1.22.4
