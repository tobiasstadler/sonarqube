/*
 * SonarQube
 * Copyright (C) 2009-2020 SonarSource SA
 * mailto:info AT sonarsource DOT com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */

import * as React from 'react';
import { getSecurityHotspotDetails } from '../../../api/security-hotspots';
import { BranchLike } from '../../../types/branch-like';
import { DetailedHotspot } from '../../../types/security-hotspots';
import HotspotViewerRenderer from './HotspotViewerRenderer';

interface Props {
  branchLike?: BranchLike;
  hotspotKey: string;
  securityCategories: T.StandardSecurityCategories;
}

interface State {
  hotspot?: DetailedHotspot;
  loading: boolean;
}

export default class HotspotViewer extends React.PureComponent<Props, State> {
  mounted = false;

  componentWillMount() {
    this.mounted = true;
    this.fetchHotspot();
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.hotspotKey !== this.props.hotspotKey) {
      this.fetchHotspot();
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  fetchHotspot() {
    this.setState({ loading: true });
    return getSecurityHotspotDetails(this.props.hotspotKey)
      .then(hotspot => this.mounted && this.setState({ hotspot }))
      .finally(() => this.mounted && this.setState({ loading: false }));
  }

  render() {
    const { branchLike, securityCategories } = this.props;
    const { hotspot, loading } = this.state;

    return (
      <HotspotViewerRenderer
        branchLike={branchLike}
        hotspot={hotspot}
        loading={loading}
        securityCategories={securityCategories}
      />
    );
  }
}
