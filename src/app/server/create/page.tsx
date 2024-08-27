'use client';
import { SubmitButton } from '@/components/form/SubmitButton';
import CreateServerForm from '@/features/server/create-server/CreateServerForm';

const CreateServerPage = () => {
  return (
    <div>
      <CreateServerForm>
        {(pending) => <SubmitButton loading={pending}>Test</SubmitButton>}
      </CreateServerForm>
    </div>
  );
};

export default CreateServerPage;
