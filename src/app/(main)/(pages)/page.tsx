import { redirect } from 'next/navigation';

const MainPage = () => {
  redirect('/channels/me');
};

export default MainPage;

// BETTER LAYOUT, TO IMPLEMENT LATER
// export const ChatLayout = () => {
//   return (
//     <div className="h-screen grid grid-cols-[auto,auto,1fr,auto] grid-rows-[auto,1fr,auto]">
//       <div className="bg-black row-span-3">
//         <ServerList />
//       </div>
//       <div className="bg-zinc-800 row-span-3">
//         <ChannelList />
//       </div>
//       <div className="bg-red-600 col-span-2">
//         <Header />
//       </div>
//       <div className="bg-green-600 overflow-y-auto">
//         <Chat />
//       </div>
//       <div className="bg-blue-600 row-span-2">
//         <MemberList />
//       </div>
//       <div className="bg-red-600">
//         <ChatInput />
//       </div>
//     </div>
//   );
// };

// const ServerList = () => {
//   return <div className="p-4 text-white">SERVER LIST</div>;
// };

// const ChannelList = () => {
//   return <div className="p-4 text-white">CHANNEL LIST</div>;
// };

// const Header = () => {
//   return <div className="p-4 text-white">HEADER</div>;
// };

// const Chat = () => {
//   return <div className="p-4 text-white h-full">SCROLLABLE CHAT</div>;
// };

// const MemberList = () => {
//   return <div className="p-4 text-white">MEMBER LIST</div>;
// };

// const ChatInput = () => {
//   return <div className="p-4 text-white">CHAT INPUT</div>;
// };
