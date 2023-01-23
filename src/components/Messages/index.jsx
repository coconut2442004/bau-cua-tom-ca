import { faLeftLong, faMessage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment/moment";
import { useState, useRef, useContext, useEffect } from "react";
import { listenDocument, updateArrayField } from "../../firebase/util";
import { UserContext } from "../../providers/User";

function Messages({ roomId }) {
  const mesBoardRef = useRef();
  const [message, setMessage] = useState("");
  const [messageInRoom, setMessageInRoom] = useState({
    content: [],
    roomId: roomId,
  });
  const UserData = useContext(UserContext);

  useEffect(() => {
    listenDocument("Messages", roomId, (data) => {
      if (data !== undefined) {
        setMessageInRoom(data);
      }
    });
  }, [roomId]);

  const { user } = UserData;
  return (
    <>
      <div
        className="flex items-center justify-center p-2 absolute top-[10px] right-[10px] cursor-pointer text-black bg-white rounded-lg shadow-lg"
        onClick={() => {
          mesBoardRef.current.classList.add("active");
        }}
      >
        <FontAwesomeIcon icon={faMessage} />
      </div>
      <div
        className="absolute top-0 right-0 bottom-0 w-[360px] bg-[white] p-2 translate-x-[200%] message shadow-lg"
        ref={mesBoardRef}
      >
        <div
          className="text-black absolute top-[10px] left-[10px] text-[18px] cursor-pointer hover:opacity-[0.5] transition-all duration-300 ease-out"
          onClick={() => {
            mesBoardRef.current.classList.remove("active");
          }}
        >
          <FontAwesomeIcon icon={faLeftLong} />
        </div>
        <div className="overflow-y-scroll h-[90%] mt-[30px] scroll-hidden border-t-2 border-gray-800 border-b-2">
          {messageInRoom.content.length > 0
            ? messageInRoom.content.map((e) => {
                return (
                  <div
                    className="flex items-center mb-2 mt-2 message-content"
                    key={e.createdAt}
                  >
                    <img
                      className="w-[55px] h-[55px] rounded-full shadow-lg"
                      src={e.author.photo}
                      alt="avatar"
                    />
                    <div className="ml-2 p-2 bg-[var(--message)] rounded-lg shadow-lg">
                      <p className="text-sm">{e.author.username}</p>
                      <p className="text-[14px]">{e.text}</p>
                    </div>
                  </div>
                );
              })
            : false}
        </div>
        <div className="flex items-center justify-evenly m-2">
          <input
            type="text"
            placeholder="Nhập vào tin nhắn..."
            className="p-2 outline-none"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
          />
          <button
            className="p-2 rounded-lg bg-[var(--primary)] hover:opacity-[0.5] transition-all duration-300 ease-out"
            onClick={() => {
              updateArrayField("Messages", roomId, "content", {
                author: user,
                roomId: roomId,
                text: message,
                createdAt: moment().format(),
              });
              setMessage("");
            }}
          >
            Gửi
          </button>
        </div>
      </div>
    </>
  );
}

export default Messages;