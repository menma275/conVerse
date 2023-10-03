import Card from "@/components/card";

const CardLoop = ({ dataList }) => {
  return (
    <>
      {/* dataListの各データを元にカードをマッピングして表示 */}
      {dataList.map((data, index) => (
        <Card data={data} key={index} />
      ))}
    </>
  );
};

export default CardLoop;
