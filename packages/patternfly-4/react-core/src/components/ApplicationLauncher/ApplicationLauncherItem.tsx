import * as React from 'react';
import { css } from '@patternfly/react-styles';
import styles from '@patternfly/react-styles/css/components/AppLauncher/app-launcher';
import { DropdownItem, DropdownItemProps } from '../Dropdown';
import { ApplicationLauncherContent } from './ApplicationLauncherContent';
import { ApplicationLauncherContext } from './ApplicationLauncher';
import { StarIcon } from '@patternfly/react-icons';

export const ApplicationLauncherItemContext = React.createContext({ isExternal: false, icon: null });

export interface ApplicationLauncherItemProps {
  /** Icon rendered before the text */
  icon?: React.ReactNode;
  /** If clicking on the item should open the page in a separate window */
  isExternal?: boolean;
  /** Tooltip to display when hovered over the item */
  tooltip?: React.ReactNode;
  /** Additional tooltip props forwarded to the Tooltip component */
  tooltipProps?: any;
  /** The component that will wrap the item.
   * If you need to render a custom component, for example a react router Link component,
   * then pass the component here. Example:
   * <ApplicationLauncherItem key="router1" component={
   *   <Link to="/components/alert/">
   *     <ApplicationLauncherContent>Router link</ApplicationLauncherContent>
   *   </Link>
   * } />
   */
  component?: React.ReactNode;
  /** Flag indicating if the item is favorited */
  isFavorite?: boolean;
  /** Aria label text for favoritable button when favorited */
  ariaIsFavoriteLabel?: string;
  /** Aria label text for favoritable button when not favorited */
  ariaIsNotFavoriteLabel?: string;
  /** ID of the item. Required for tracking favorites. */
  id?: string;
  customChild?: React.ReactNode;
  /** Flag indicating if hitting enter triggers an arrow down key press. Automatically passed to favorites list items. */
  enterTriggersArrowDown?: boolean;
}

export const ApplicationLauncherItem: React.FunctionComponent<ApplicationLauncherItemProps & DropdownItemProps> = ({
  className = '',
  id,
  children,
  icon = null,
  isExternal = false,
  href,
  tooltip = null,
  tooltipProps = null,
  component = 'a',
  isFavorite = null,
  ariaIsFavoriteLabel = 'starred',
  ariaIsNotFavoriteLabel = 'not starred',
  customChild,
  enterTriggersArrowDown = false,
  ...props
}: ApplicationLauncherItemProps & DropdownItemProps) => (
  <ApplicationLauncherItemContext.Provider value={{ isExternal, icon }}>
    <ApplicationLauncherContext.Consumer>
      {({ onFavorite }) => (
        <DropdownItem
          id={id}
          component={component}
          href={href || null}
          className={css(
            isExternal && styles.modifiers.external,
            isFavorite !== null && styles.modifiers.link,
            className
          )}
          listItemClassName={css(onFavorite && styles.appLauncherMenuWrapper, isFavorite && styles.modifiers.favorite)}
          tooltip={tooltip}
          tooltipProps={tooltipProps}
          {...(enterTriggersArrowDown === true && { enterTriggersArrowDown })}
          {...(customChild && { customChild: customChild })}
          {...(isFavorite !== null && {
            additionalChild: (
              <button
                className={css(styles.appLauncherMenuItem, styles.modifiers.action)}
                aria-label={isFavorite ? ariaIsFavoriteLabel : ariaIsNotFavoriteLabel}
                onClick={() => {
                  onFavorite(id, isFavorite);
                }}
              >
                <StarIcon />
              </button>
            )
          })}
          {...props}
        >
          {children && <ApplicationLauncherContent>{children}</ApplicationLauncherContent>}
        </DropdownItem>
      )}
    </ApplicationLauncherContext.Consumer>
  </ApplicationLauncherItemContext.Provider>
);
