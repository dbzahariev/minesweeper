import "../styles/NumberDisplay.scss";

function NumberDisplay({ value }: { value: number }) {
  return (
    <div
      style={{
        width: "80px",
        height: "48px",
        color: "#ff0000",
        background: "black",
        textAlign: "center",
        fontSize: "40px",
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
      }}
    >
      <span>
        {value < 0
          ? `-${Math.abs(value).toString().padStart(2, "0")}`
          : value.toString().padStart(3, "0")}
      </span>
    </div>
  );
}

export default NumberDisplay;
