import React from 'react';
import { Cluster, ManagedDomain } from '../../api/types';
import { getManagedDomains } from '../../api/domains';
import { handleApiError, getErrorMessage } from '../../api/utils';
import LoadingState from '../ui/uiState/LoadingState';
import ClusterConfigurationForm from './ClusterConfigurationForm';
import { AlertsContext } from '../AlertsContextProvider';

type ClusterConfigurationProps = {
  cluster: Cluster;
};
const ClusterConfiguration: React.FC<ClusterConfigurationProps> = ({ cluster }) => {
  const [domains, setDomains] = React.useState<ManagedDomain[] | undefined>();
  const { addAlert } = React.useContext(AlertsContext);

  React.useEffect(() => {
    const fetchManagedDomains = async () => {
      try {
        const { data } = await getManagedDomains();
        setDomains(data);
      } catch (e) {
        setDomains([]);
        handleApiError(e, () =>
          addAlert({ title: 'Failed to retrieve managed domains', message: getErrorMessage(e) }),
        );
      }
    };
    fetchManagedDomains();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (domains) {
    return <ClusterConfigurationForm cluster={cluster} managedDomains={domains} />;
  }
  return <LoadingState content="Loading configuration..." />;
};

export default ClusterConfiguration;
