export async function postJSON(url = "", data = {}) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log("postJSON Success:", result);
    return result;
    
  } catch (error) {
    console.error("postJSON Error:", error);
  }
}

// 사용 예시

// const url = "https://example.com/answer";
// const data = { answer: 42 };

// 출력 타입 1
// postJSON(url, data).then((data) => {
//   console.log(data); // JSON 객체이다. by `data.json()` call
// });

// 출력 타입 2. 함수 위에 async 키워드를 작성해주어야한다.
// const result = await postJSON(url, data);
// console.log(`결과 값 : `, result);
