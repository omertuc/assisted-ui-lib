import React from 'react';
import { saveAs } from 'file-saver';
import {
  Button,
  ButtonVariant,
  ClipboardCopy,
  clipboardCopyFunc,
  EmptyState,
  EmptyStateIcon,
  EmptyStateVariant,
  Title,
  ModalBoxBody,
  ModalBoxFooter,
  TextContent,
} from '@patternfly/react-core';
import { global_success_color_100 as successColor } from '@patternfly/react-tokens';
import { CheckCircleIcon } from '@patternfly/react-icons';
import { Cluster } from '../../api/types';
import { getClusterDownloadsImageUrl } from '../../api/clusters';
import { DetailList, DetailItem } from '../ui/DetailList';

type DiscoveryImageSummaryProps = {
  cluster: Cluster;
  imageInfo: Cluster['imageInfo'];
  onClose: () => void;
  onReset: () => void;
};

const DiscoveryImageSummary: React.FC<DiscoveryImageSummaryProps> = ({
  cluster,
  imageInfo,
  onClose,
  onReset,
}) => {
  const isoPath = getClusterDownloadsImageUrl(cluster.id);
  const isoUrl = `${window.location.origin}${isoPath}`;
  const downloadUrl = imageInfo.downloadUrl || isoUrl;

  const wgetCommand = `wget -O 'discovery_image_${cluster.name}.iso' '${downloadUrl}'`;

  return (
    <>
      <ModalBoxBody>
        <EmptyState variant={EmptyStateVariant.small}>
          <EmptyStateIcon icon={CheckCircleIcon} color={successColor.value} />
          <Title headingLevel="h4" size="lg">
            Discovery ISO is ready to download
          </Title>
        </EmptyState>
        <TextContent>
          <DetailList>
            <DetailItem
              title="Discovery ISO URL"
              value={
                <ClipboardCopy isReadOnly onCopy={(event) => clipboardCopyFunc(event, downloadUrl)}>
                  {downloadUrl}
                </ClipboardCopy>
              }
            />
            <DetailItem
              title="Command to download the ISO"
              value={
                <ClipboardCopy isReadOnly onCopy={(event) => clipboardCopyFunc(event, wgetCommand)}>
                  {wgetCommand}
                </ClipboardCopy>
              }
            />
          </DetailList>
          <DetailItem
            title="Boot instructions"
            value={
              <>
                Use a bootable device (local disk, USB drive, etc.) or network booting (PXE) to boot
                each host <b>once</b> from the Discovery ISO.
              </>
            }
          ></DetailItem>
        </TextContent>
      </ModalBoxBody>
      <ModalBoxFooter>
        <Button
          variant={ButtonVariant.primary}
          onClick={() => saveAs(downloadUrl)}
          data-test-id="download-iso-btn"
        >
          Download Discovery ISO
        </Button>
        <Button variant={ButtonVariant.secondary} onClick={onClose} data-test-id="close-iso-btn">
          Close
        </Button>
        <Button variant={ButtonVariant.link} onClick={onReset} data-test-id="edit-iso-btn">
          Edit ISO Configuration
        </Button>
      </ModalBoxFooter>
    </>
  );
};

export default DiscoveryImageSummary;
