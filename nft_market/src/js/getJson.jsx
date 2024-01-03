export async function getJSON(url = "") {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error("네트워크 응답이 올바르지 않습니다");
      }
  
      const result = await response.json();
      console.log("getJSON 성공:", result);
      return result;
    } catch (error) {
      console.error("getJSON 오류:", error);
    }
  }

// getSchema.json에서 데이터 가져오기 위한 사용법
// const url = "public/data/getSchema.json";

// try {
//   const result = await getJSON(url);
//   console.log("결과 값:", result);
// } catch (error) {
//   console.error("데이터를 가져오는 중 오류 발생:", error);
// }