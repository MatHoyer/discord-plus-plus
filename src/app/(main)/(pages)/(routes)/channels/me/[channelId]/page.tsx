const page = (props: PageParams<{ channelId: string }>) => {
  return <div>{props.params.channelId}</div>;
};

export default page;
