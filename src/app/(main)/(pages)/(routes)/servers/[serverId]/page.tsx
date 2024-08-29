const ServerPage = (props: PageParams<{ serverId: string }>) => {
  return <div>Server: {props.params.serverId}</div>;
};

export default ServerPage;
