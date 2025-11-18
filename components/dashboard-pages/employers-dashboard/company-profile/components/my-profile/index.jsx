import FormInfoBox from "./FormInfoBox";
/* import LogoCoverUploader from "./LogoCoverUploader"; */

const index = ({ setActiveTab }) => {
  return (
    <div className="widget-content">
      <FormInfoBox setActiveTab={setActiveTab} />
      {/* compnay info box */}
      {/*      <LogoCoverUploader /> */}
      {/* End logo and cover photo components */}
    </div>
  );
};

export default index;
