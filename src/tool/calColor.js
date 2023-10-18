export default calColor = {
    getBackgroundColor:(type)=>{
        if(type===0) {
            return 'white'
        }
        if(type === 1) {
            return 'grey'
        }
        if(type===2) {
            return 'pink'
        }
        if(type===3) {
            return 'green'
        }
        if(type === 4) {
            return 'blue'
        }
    },
    getTextColor:(type)=>{
        if(type===0) {
            return 'black'
        }
        if(type === 1) {
            return 'white'
        }
        if(type===2) {
            return 'white'
        }
        if(type===3) {
            return 'white'
        }
        if(type === 4) {
            return 'white'
        }
    }
}