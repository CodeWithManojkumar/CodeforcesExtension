/*****************Toggle between Pages*****************/
function click1() {
  document.getElementById("container").style.display = "block";
  document.getElementById("contests").style.display = "none";
  document.getElementById("questions").style.display = "none";
}
function click2() {
  document.getElementById("container").style.display = "none";
  document.getElementById("contests").style.display = "block";
  document.getElementById("questions").style.display = "none";
}
function click3() {
  document.getElementById("container").style.display = "none";
  document.getElementById("contests").style.display = "none";
  document.getElementById("questions").style.display = "block";
}
document.getElementById("btn1").addEventListener("click", click1);
document.getElementById("btn2").addEventListener("click", click2);
document.getElementById("btn3").addEventListener("click", click3);
/****************************************************/

/*************Profile Information*******************/

const CF_Handle = "manoj_kgp";

fetch(`https://codeforces.com/api/user.info?handles=${CF_Handle}`)
  .then((data) => data.json())
  .then((user) => {
    var name = user.result[0].firstName + " " + user.result[0].lastName;
    var handle = user.result[0].handle;
    var currrating = user.result[0].rating;
    var maxRating = user.result[0].maxRating;
    var currRanking = user.result[0].rank;
    document.getElementById("fullName").innerHTML = `
      <tr>
            <td style='width:40%'>Name</td>
            <td style='width:60%'>${name}</td>
      </tr>
      <tr>
            <td>Handle</td>
            <td><a target="_blank" href="https://codeforces.com/profile/${handle}">${handle}</a></td>
      </tr>
      <tr>
            <td>Current Rating</td>
            <td>${currrating}</td>
      </tr>
      <tr>
            <td>Maximum Rating</td>
            <td>${maxRating}</td>
      </tr>
      <tr>
            <td>Current Ranking</td>
            <td>${currRanking}</td>
      </tr>
      `;
  })
  .catch((er) => console.log(er));

//*****************************************************/

//********************Future Contests*******************/
function unixTimetostd(unixTime) {
  var date = new Date(unixTime * 1000);
  return date.toLocaleDateString();
}
function duration(value) {
  let seconds = parseInt(value, 10);
  let hours = Math.floor(seconds / 3600);
  let minutes = Math.floor((seconds - hours * 3600) / 60);
  seconds = seconds - hours * 3600 - minutes * 60;

  if (hours < 10) hours = "0" + hours;
  if (minutes < 10) minutes = "0" + minutes;
  if (seconds < 10) seconds = "0" + seconds;

  return hours + ":" + minutes + ":" + seconds;
}

fetch("https://codeforces.com/api/contest.list?gym=false")
  .then((data) => data.json())
  .then((contests) => {
    const contestList = document.getElementById("contestList");
    let futureContests = [];

    contests.result.forEach((contest) => {
      if (contest.phase == "BEFORE") {
        futureContests.push([
          contest.durationSeconds,
          contest.name,
          contest.startTimeSeconds,
          contest.relativeTimeSeconds,
        ]);
      }
    });

    futureContests.sort(function (x, y) {
      return new Date(y) - new Date(x);
    });
    futureContests.reverse();

    const contestTable = futureContests
      .map((contest) => {
        const startTime = unixTimetostd(contest[2]);
        const durationTime = duration(contest[0]);

        const timeLeft = -contest[3];

        let days = parseInt(timeLeft / 86400);
        let hours = parseInt((timeLeft % 86400) / 3600);
        let minutes = parseInt(((timeLeft % 86400) % 3600) / 60);

        let time = days + " Days " + hours + " Hours " + minutes + " Minutes ";

        return `<tr>
          <td style = "width = 60%"><a target = "_blank" href = "https://codeforces.com/contests">${contest[1]}</a></td>
          <td style = "width = 20%">${time}</td>
          <td style = "width = 20%">${durationTime}</td>
      </tr>`;
      })
      .join("");

    contestList.innerHTML = `<tr>
        <th>Name</th>
        <th>Time Remaining</th>
        <th>Duration</th>
      </tr>
      ${contestTable}`;
  })
  .catch((er) => console.log(er));
//*****************************************************/

//******************Questions**************************/

const questionBtn = document.getElementById("questionButton");

questionBtn.addEventListener("click", () => {
  const tag = document.getElementById("questionKeyword").value.toLowerCase();
  let maxRating = Number(document.getElementById("maxRating").value);
  let minRating = Number(document.getElementById("minRating").value);

  if (maxRating == 0 && minRating == 0) {
    minRating = 0;
    maxRating = 1800;
  }

  fetch(`https://codeforces.com/api/problemset.problems?tags=${tag}`)
    .then((res) => {
      return res.json();
    })
    .then((questions) => {
      let questionsList = [];
      questions.result.problems.forEach((problem) => {
        if (problem.rating <= maxRating && problem.rating >= minRating) {
          questionsList.push([
            problem.contestId,
            problem.index,
            problem.name,
            problem.rating,
          ]);
        }
      });

      let shuffled = questionsList.sort(() => 0.5 - Math.random());
      shuffled = shuffled.slice(0, Math.min(5, shuffled.length));

      const newTable = shuffled
        .map((question) => {
          return `<tr>
        <th>${question[2]}</th>
        <th><a target="_blank" 
        href="https://codeforces.com/problemset/problem/${question[0]}/${question[1]}">Solve</a></th>
        <th>${question[3]}</th>
        </tr>`;
        })
        .join("");
      const questionsListHTML = document.getElementById("questionsList");
      questionsListHTML.innerHTML = `
      <table class="table table-bordered" id="questionsListTable">
            <tr>
              <th>Name</th>
              <th>Link</th>
              <th>Rating</th>
            </tr>
            ${newTable}
      </table>`;
    })
    .catch((err) => console.log(err));
});
/***********************************************************/
