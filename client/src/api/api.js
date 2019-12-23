export async function createRoom(options) {
  return callApi('api/create', {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(options),
  });
}

export async function checkName(name) {
  return callApi(`api/checkname?name=${name}`);
}

export async function checkCode(roomCode) {
  return callApi(`api/checkcode?roomCode=${roomCode}`);
}

export async function attemptJoin(roomCode, name, password) {
  let body = {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  }; 
  return callApi(`api/attemptjoin?roomCode=${roomCode}&name=${name}`, body);
}

export async function callApi(path, data) {
  const response = await fetch(path, data);
  const body = await response.json();

  if (response.status !== 200) {
    throw Error(body.message);
  }

  return body;
};
