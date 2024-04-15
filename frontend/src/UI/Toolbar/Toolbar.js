export const Toolbar = ({addMemo}) => {
    return (
        <>
            <div className="toolbar" style={{position:'absolute', top:'5%', right:'5%'}}>
                <button onClick={(e) => addMemo()}>Add Memo</button>
            </div>
        </>
    )
}
export default Toolbar;