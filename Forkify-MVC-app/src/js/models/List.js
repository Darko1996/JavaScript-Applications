import uniqid from 'uniqid';

export default class List{
    constructor(){
        this.items = [];
    }

    addItem(count, unit, ingredient){
        const item = {
            id: uniqid(), //instlirali smo package da generise automatski id na osnovu koga rade funk deleteItem() i updateCount()
            count, // isto sto i count: count
            unit,
            ingredient
        }
        this.items.push(item);
        return item;
    }

    deleteItem(id){
        const index = this.items.findIndex(el => el.id === id);
        //[1,2,3] splice(1,2) --> returns [2,3], original array is [1]
        //[1,2,3] slice(1,2) --> returns [2], original array is [1,2,3]

        this.items.splice(index,1);
    }

    updateCount(id, newCount){
        this.items.find(el => el.id === id).count = newCount;
    }
}