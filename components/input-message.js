const InputMessage = (Props) => {
  //input要素の入力を反映
  const handleChange = (e) => {
    Props.setMessage(e.target.value);
  };

  return (
    <>
      <div className="post-set">
        <input id="input-post" type="text" placeholder="Input your message." value={Props.message} onChange={handleChange} />
        {/* <form id="deleteForm"><button type="submit">Reset</button></form> */}
      </div>
    </>
  );
};
export default InputMessage;
