const ServerPage = (
  props: PageParams<{ serverId: string; channelId: string }>
) => {
  return (
    <div>
      Server: {props.params.serverId}, Channel: {props.params.channelId}
    </div>
  );
};

export default ServerPage;
