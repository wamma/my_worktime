document.getElementById('calc-btn').addEventListener('click', calculateWorkTime);

function parseTime(str) {
	const [h, m] = str.split(':').map(Number);
	return h * 60 + m;
}

function parseTimeRange(rangeStr) {
	const [start, end] = rangeStr.split(/\s*-\s*/);
	if (!end) return null;
	const minutes = parseTime(end) - parseTime(start);
	return minutes > 0 ? minutes : 0;
}

function calculateWorkTime() {
	const rows = document.querySelectorAll('#time-table tbody tr');
	const MAX_WEEK = 45 * 60;  // 분 단위
	let total = 0;
	let fridayStart = null;

	rows.forEach(row => {
		const day = row.cells[0].textContent.trim();
		const trInput = row.querySelector('.timerange').value.trim();

		if (!trInput) return;
		if (day === '금') {
			fridayStart = trInput.split('-')[0].trim();
			const m = parseTimeRange(trInput);
			if (m) total += m;
		} else {
			const m = parseTimeRange(trInput);
			if (m) total += m;
		}
	});

	const remain = MAX_WEEK - total;
	const rh = Math.floor(remain / 60), rm = remain % 60;

	let html = `
    <h2>📊 근무 시간 요약</h2>
    <p>⏱️ 누적: ${Math.floor(total / 60)}시간 ${total % 60}분</p>
    <p>🕒 남은: ${rh}시간 ${rm}분</p>
  `;

	if (fridayStart) {
		const [fh, fm] = fridayStart.split(':').map(Number);
		const endMin = fh * 60 + fm + remain;
		const eh = Math.floor(endMin / 60).toString().padStart(2, '0');
		const em = (endMin % 60).toString().padStart(2, '0');

		html += `
      <p>📅 금 출근: ${fridayStart}</p>
      <p>🏁 퇴근 예상: ${eh}:${em}</p>
    `;
		if (remain <= 9 * 60) {
			html += `<p style="color:red;">🚨 너 당장 재택해!!!!! 🏠💻</p>`;
		}
	}

	document.getElementById('result').innerHTML = html;
}
