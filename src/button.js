return (
    <div>
        <input type="checkbox" id="ch">
        <label htmlFor="ch">click</label>
    </div>
)



<input type="checkbox" id="ch">

<label for="ch">click</label> // we use htmlFor when in jsx

//////
//////

submit() {
    const fd = new FormData;
    axios.post('/upload', fd).then(
        ({data}) => {
            this.props.updateImage(data.imageUrl)
        }
    )
}
