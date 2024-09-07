const FriendPage = (props: PageParams<{ friendId: string }>) => {
  return <div>Friend id: {props.params.friendId}</div>;
};

export default FriendPage;
