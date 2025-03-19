# 3DDiceRoller
## Project Overview
**Description:** A 3D dice roller designed for tabletop RPG games such as Dungeons and Dragons.

**Libraries:** ThreeJS for the 3D environment and CannonJS for physics

**Additional features / concepts:** Local storage, UV mapping

## Controls
**View movement:** Uses ThreeJS orbit controls. Click and drag around the scene to look around. Click and drag around the scene while holding "shift" or "ctrl" to move. You can use arrow keys to move around as well. Zoom in or out using the trackpad or mouse. 

**Dice rolling options:** Click on the arrows for each of the dice types to increase or decrease the count of preset multi-dice rolls. Click the roll button in the top left corner to roll this preset number of all dice types. Click on the number to roll that number of that one type of die. Click on the name of the die type to roll one fo that type regardless of the preset number. 

**Buttons:** The roll button rolls the preset number of all dice types. The sweep button clears the board. The reset button clears the board and resets all of the presets to 0. 

**Click controls:** Click on a die on the board if you cannot see it well to add it to the number view at the top. Numbers will either be listed or added depending on the “autosum” setting. Note that dice will be removed from the board once they are clicked on. Double click anywhere on the screen to automatically sum all dice on the board without removing them. Any dice that do not have a clear side face up and are at an angle will be listed as “-1” and not added to the double click sum.
## Menu
_Opened by selecting the menu button in the top right corner._

**Current set dropdown:** Lists all available dice sets. The one selected is the one that will be rolled the next time you roll a die. Note that it is only possible to have multiple types of dice on the board if you have “autosweep” disabled and switch the active dice set between rolls.

**Add dice set:** Opens the dice creator, which allows you to make your own set to be added to the dice set dropdown. Dice sets you create are saved using local storage, meaning it will stay saved on your computer as data for the website until your history is cleared.

**Environment:** Determines the background image of the 3D world and impacts how lighting and reflections work on the dice.

**Autosweep:** When on, dice will be cleared from the board every time you make a roll of any kind. When off, dice will be added to the board when you roll, and none will be cleared unless you use the “sweep” or “reset” buttons.

**Autosum:** When on, clicking on the dice on the board will add to the number at the top. When off, clicking on the dice will add to a list of numbers at the top. Double clicking on the screen will show the sum of all numbers on the board at the top regardless of this setting.

**Visible floor:** When on, the floor is visible. When off, it is not visible, but collisions still work between the dice and where the floor would be.
## Dice Creator
_Opened by selecting the "Add dice set" button in the menu._

**Dice set name:** The name of your dice set material and how it will be listed in the “current set” dropdown selection.

**Colors:** The main color of the dice and the color of the text.

**Font:** The font used for the dice. Some that work well are “Arial”, “Arial black”, and “Garamond” for various styles.

**Roughness:** How shiny or rough a material will appear on a scale of 0 to 1.

**Metalness:** How metallic a material will appear on a scale of 0 to 1.

**Clearcoat:** The intensity of a sort of external top-coat layer on the dice surface on a scale of 0 to 1.

**Clearcoat roughness:** The roughness of the clear coat layer on a scale of 0 to 1.

**Submit:** Clicking this will create the dice set and add it to the dropdown options. An alert should pop up to confirm that the set was created.
# Possible Iterations
- Keyboard keypress shortcuts for actions
- Font options or custom fonts
- Higher quality environment images
- Options for transparent or translucent dice
- Way to remove custom dice sets from options
- Add settings to local storage
- Make it more mobile-friendly

Feel free to share any suggestions for improvements on the project or if you specifically want any of the above possiblities integrated. 



