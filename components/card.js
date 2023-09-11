const Card = ({ dataList }) => {
  return (
    <>
      {dataList.map((data, index) => (
        <div className="card" key={index} style={{ left: data.pos.x, top: data.pos.y, boxShadow: data.color + "0px 0px 1rem 0.1rem" }}>
          {data.text}
        </div>
      ))}
    </>
  );
};
export default Card;
