const Card = ({ dataList }) => {
  return (
    <>
      {dataList.map((data, index) => (
        <div
          className="card"
          key={index}
          style={{
            left: data.pos.x,
            top: data.pos.y,
            boxShadow: "0px 0px 0.25rem 0.05rem" + data.color,
          }}
        >
          {data.text}
        </div>
      ))}
    </>
  );
};
export default Card;
