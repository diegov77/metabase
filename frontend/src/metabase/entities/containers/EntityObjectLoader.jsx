/* @flow */

import React from "react";
import { connect } from "react-redux";
import { createSelector } from "reselect";

import entityType from "./EntityType";
import LoadingAndErrorWrapper from "metabase/components/LoadingAndErrorWrapper";

export type Props = {
  entityType?: string,
  reload?: boolean,
  wrapped?: boolean,
  loadingAndErrorWrapper: boolean,
  children: (props: RenderProps) => ?React$Element<any>,
};

export type RenderProps = {
  object: ?any,
  loading: boolean,
  error: ?any,
  remove: () => Promise<void>,
};

@entityType()
@connect((state, { entityDef, entityId }) => ({
  object: entityDef.selectors.getObject(state, { entityId }),
  loading: entityDef.selectors.getLoading(state, { entityId }),
  error: entityDef.selectors.getError(state, { entityId }),
}))
export default class EntitiesObjectLoader extends React.Component {
  props: Props;

  static defaultProps = {
    loadingAndErrorWrapper: true,
    reload: false,
    wrapped: false,
  };

  _getWrappedObject: ?(props: Props) => any;

  constructor(props: Props) {
    super(props);

    this._getWrappedObject = createSelector(
      [
        props => props.object,
        props => props.dispatch,
        props => props.entityDef,
      ],
      (object, dispatch, entityDef) =>
        object && entityDef.wrapEntity(object, dispatch),
    );
  }

  componentWillMount() {
    // $FlowFixMe: provided by @connect
    const { entityId, fetch } = this.props;
    fetch({ id: entityId }, this.props.reload);
  }
  componentWillReceiveProps(nextProps: Props) {
    // $FlowFixMe: provided by @connect
    if (nextProps.entityId !== this.props.entityId) {
      nextProps.fetch({ id: nextProps.entityId });
    }
  }
  renderChildren = () => {
    // $FlowFixMe: provided by @connect
    let { children, entityDef, wrapped, object, ...props } = this.props;

    if (wrapped) {
      // $FlowFixMe:
      object = this._getWrappedObject(this.props);
    }

    // $FlowFixMe: missing loading/error
    return children({
      ...props,
      object: object,
      // alias the entities name:
      [entityDef.nameSingular]: object,
      reload: this.reload,
      remove: this.remove,
    });
  };
  render() {
    // $FlowFixMe: provided by @connect
    const { loading, error, loadingAndErrorWrapper } = this.props;
    return loadingAndErrorWrapper ? (
      <LoadingAndErrorWrapper
        loading={loading}
        error={error}
        children={this.renderChildren}
      />
    ) : (
      this.renderChildren()
    );
  }

  reload = () => {
    // $FlowFixMe: provided by @connect
    return this.props.fetch({ id: this.props.entityId }, true);
  };

  remove = () => {
    // $FlowFixMe: provided by @connect
    return this.props.delete(this.props.object);
  };
}
