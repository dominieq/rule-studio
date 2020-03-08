/**
 * Represents object displayed in a List
 * @param {string} id - The id of an item. Used only to identify item in map.
 * @param {string} name - The name of an item. Displayed summary of an item.
 * @param {object} traits - Object containing characteristics of an item.
 * @param {array} tables - Array of arrays that store further information.
 */
class Item {
    constructor(id, name, traits, actions, tables) {
        this.id = id;
        this.name = name;
        this.traits = traits;
        this.actions = actions;
        this.tables = tables;
    }
}

export default Item;